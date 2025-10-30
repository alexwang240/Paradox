import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const CONTRACT_NAME = "Zama24Game";

task("game:address", "Prints the Zama24Game address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const deployment = await deployments.get(CONTRACT_NAME);

  console.log(`${CONTRACT_NAME} address is ${deployment.address}`);
});

task("game:start", "Starts a new encrypted round and decrypts the numbers")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get(CONTRACT_NAME);

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt(CONTRACT_NAME, contractDeployment.address, signer);

    const tx = await contract.startGame();
    console.log(`startGame tx: ${tx.hash}`);
    await tx.wait();

    const encryptedNumbers = await contract.getEncryptedNumbers(signer.address);
    const clearNumbers: string[] = [];
    for (const enc of encryptedNumbers) {
      const decrypted = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        enc,
        contractDeployment.address,
        signer,
      );
      clearNumbers.push(decrypted.toString());
    }

    console.log(`Encrypted numbers: ${encryptedNumbers.join(", ")}`);
    console.log(`Decrypted numbers: ${clearNumbers.join(", ")}`);
  });

task("game:numbers", "Decrypts the current encrypted numbers")
  .addOptionalParam("player", "Address whose state to inspect")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get(CONTRACT_NAME);

    const [defaultSigner] = await ethers.getSigners();
    const targetPlayer = taskArguments.player ?? defaultSigner.address;

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractDeployment.address, defaultSigner);
    const hasNumbers = await contract.hasActiveNumbers(targetPlayer);
    if (!hasNumbers) {
      console.log("No numbers stored for the player.");
      return;
    }
    const encryptedNumbers = await contract.getEncryptedNumbers(targetPlayer);

    const decrypted: string[] = [];
    for (const enc of encryptedNumbers) {
      const clear = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        enc,
        contractDeployment.address,
        defaultSigner,
      );
      decrypted.push(clear.toString());
    }

    console.log(`Encrypted numbers: ${encryptedNumbers.join(", ")}`);
    console.log(`Decrypted numbers: ${decrypted.join(", ")}`);
  });

task("game:submit", "Submits two indices and decrypts the result")
  .addParam("first", "First index (0-3)")
  .addParam("second", "Second index (0-3)")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const firstIndex = parseInt(taskArguments.first, 10);
    const secondIndex = parseInt(taskArguments.second, 10);

    if (Number.isNaN(firstIndex) || Number.isNaN(secondIndex)) {
      throw new Error("Indices must be integers");
    }

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get(CONTRACT_NAME);

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt(CONTRACT_NAME, contractDeployment.address, signer);

    const tx = await contract.submitGuess(firstIndex, secondIndex);
    console.log(`submitGuess tx: ${tx.hash}`);
    await tx.wait();

    const resultData = await contract.getLastResult(signer.address);
    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      resultData[0],
      contractDeployment.address,
      signer,
    );

    console.log(`Encrypted difference: ${resultData[0]}`);
    console.log(`Decrypted difference: ${decrypted}`);
    console.log(`Indices used: [${resultData[2]}, ${resultData[3]}] in round ${resultData[4]}`);
  });

task("game:result", "Decrypts the latest stored result")
  .addOptionalParam("player", "Address whose result to read")
  .addOptionalParam("address", "Override the deployed contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const contractDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get(CONTRACT_NAME);

    const [defaultSigner] = await ethers.getSigners();
    const targetPlayer = taskArguments.player ?? defaultSigner.address;

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractDeployment.address, defaultSigner);
    const resultData = await contract.getLastResult(targetPlayer);

    if (!resultData[1]) {
      console.log("No result stored for the player.");
      return;
    }

    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      resultData[0],
      contractDeployment.address,
      defaultSigner,
    );

    console.log(`Encrypted difference: ${resultData[0]}`);
    console.log(`Decrypted difference: ${decrypted}`);
    console.log(`Indices used: [${resultData[2]}, ${resultData[3]}] in round ${resultData[4]}`);
  });
