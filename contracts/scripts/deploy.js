/* eslint-disable no-console */
const { ethers } = require('hardhat');

async function main() {
  const [client, freelancer] = await ethers.getSigners();
  const Escrow = await ethers.getContractFactory('MilestoneEscrow', client);
  const esc = await Escrow.deploy(freelancer.address);
  await esc.waitForDeployment();
  const addr = await esc.getAddress();

  console.log('MilestoneEscrow deployed at:', addr);
  // example flow
  const amt = ethers.parseEther('0.1');
  await (await esc.createMilestone(amt)).wait();
  await (await esc.fundMilestone(0, { value: amt })).wait();
  await (await esc.approveMilestone(0)).wait();
  console.log('Sample milestone created, funded, and approved');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
