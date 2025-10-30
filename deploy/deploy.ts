import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedGame = await deploy("Paradox", {
    from: deployer,
    log: true,
  });

  console.log(`Paradox contract: `, deployedGame.address);
};
export default func;
func.id = "deploy_paradox"; // id required to prevent reexecution
func.tags = ["paradox"];
