async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contract with account:', deployer.address);

  const MilestoneEscrow = await ethers.getContractFactory('MilestoneEscrow');
  const escrow = await MilestoneEscrow.deploy(deployer.address, {
    value: ethers.utils.parseEther('1'),
  });

  await escrow.deployed();
  console.log('MilestoneEscrow deployed to:', escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
