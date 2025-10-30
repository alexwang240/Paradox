import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { Zama24Game, Zama24Game__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("Zama24Game")) as Zama24Game__factory;
  const gameContract = (await factory.deploy()) as Zama24Game;
  const contractAddress = await gameContract.getAddress();

  return { gameContract, contractAddress };
}

describe("Zama24Game", function () {
  let signers: Signers;
  let gameContract: Zama24Game;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ gameContract, contractAddress } = await deployFixture());
  });

  it("generates four decryptable random numbers within the expected range", async function () {
    const tx = await gameContract.connect(signers.alice).startGame();
    await tx.wait();

    const encryptedNumbers = await gameContract.getEncryptedNumbers(signers.alice.address);
    expect(encryptedNumbers.length).to.eq(4);

    for (const enc of encryptedNumbers) {
      const clear = await fhevm.userDecryptEuint(FhevmType.euint32, enc, contractAddress, signers.alice);
      const value = Number(clear);
      expect(value).to.be.gte(1);
      expect(value).to.be.lte(20);
    }
  });

  it("returns the encrypted absolute difference to 24", async function () {
    const tx = await gameContract.connect(signers.alice).startGame();
    await tx.wait();

    const encryptedNumbers = await gameContract.getEncryptedNumbers(signers.alice.address);
    const clearNumbers: number[] = [];
    for (const enc of encryptedNumbers) {
      const clear = await fhevm.userDecryptEuint(FhevmType.euint32, enc, contractAddress, signers.alice);
      clearNumbers.push(Number(clear));
    }

    const guessTx = await gameContract.connect(signers.alice).submitGuess(0, 1);
    await guessTx.wait();

    const [encryptedResult, hasResult] = await gameContract.getLastResult(signers.alice.address);
    expect(hasResult).to.eq(true);

    const decryptedResult = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedResult,
      contractAddress,
      signers.alice,
    );

    const expectedDifference = Math.abs(clearNumbers[0] + clearNumbers[1] - 24);
    expect(Number(decryptedResult)).to.eq(expectedDifference);
  });
});
