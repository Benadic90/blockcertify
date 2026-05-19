const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  console.log(`Deploying CertificateRegistry on network: ${networkName}`);

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("==========================================");
  console.log(`CertificateRegistry deployed successfully.`);
  console.log(`Network: ${networkName}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log("==========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
