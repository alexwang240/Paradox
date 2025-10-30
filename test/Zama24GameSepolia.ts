import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { Zama24Game } from "../types";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("Zama24GameSepolia", function () {
  let signers: Signers;
  let gameContract: Zama24Game;
  let gameContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const deployment = await deployments.get("Zama24Game");
      gameContractAddress = deployment.address;
      gameContract = (await ethers.getContractAt("Zama24Game", deployment.address)) as Zama24Game;
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("executes a full round and decrypts the difference", async function () {
    steps = 7;
    this.timeout(4 * 40000);

    progress("Calling startGame()...");
    const startTx = await gameContract.connect(signers.alice).startGame();
    await startTx.wait();

    progress("Fetching encrypted numbers...");
    const encryptedNumbers = await gameContract.getEncryptedNumbers(signers.alice.address);
    expect(encryptedNumbers.length).to.eq(4);

    progress("Decrypting numbers...");
    const clearNumbers: number[] = [];
    for (const enc of encryptedNumbers) {
      const clear = await fhevm.userDecryptEuint(FhevmType.euint32, enc, gameContractAddress, signers.alice);
      clearNumbers.push(Number(clear));
    }

    progress("Submitting guess (0,1)...");
    const guessTx = await gameContract.connect(signers.alice).submitGuess(0, 1);
    await guessTx.wait();

    progress("Retrieving last result...");
    const [encryptedResult, hasResult] = await gameContract.getLastResult(signers.alice.address);
    expect(hasResult).to.eq(true);

    progress("Decrypting last result...");
    const clearResult = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedResult,
      gameContractAddress,
      signers.alice,
    );

    progress(`Decrypted difference is ${clearResult}`);
    const expectedDifference = Math.abs(clearNumbers[0] + clearNumbers[1] - 24);
    expect(Number(clearResult)).to.eq(expectedDifference);
  });
});
