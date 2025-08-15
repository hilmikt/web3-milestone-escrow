const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MilestoneEscrow reverts', function () {
  it('reverts when non-client creates/approves/funds', async () => {
    const [client, freelancer, rando] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory('MilestoneEscrow', client);
    const esc = await Escrow.deploy(freelancer.address);
    await esc.waitForDeployment();

    await expect(esc.connect(rando).createMilestone(1)).to.be.revertedWithCustomError(
      esc,
      'NotClient'
    );
    await esc.createMilestone(ethers.parseEther('0.1'));
    await expect(
      esc.connect(rando).fundMilestone(0, { value: ethers.parseEther('0.1') })
    ).to.be.revertedWithCustomError(esc, 'NotClient');
    await expect(esc.connect(rando).approveMilestone(0)).to.be.revertedWithCustomError(
      esc,
      'NotClient'
    );
  });

  it('reverts release before approval and double release', async () => {
    const [client, freelancer] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory('MilestoneEscrow', client);
    const esc = await Escrow.deploy(freelancer.address);
    await esc.waitForDeployment();

    await esc.createMilestone(ethers.parseEther('0.1'));
    await esc.fundMilestone(0, { value: ethers.parseEther('0.1') });

    await expect(esc.connect(freelancer).releaseMilestone(0)).to.be.revertedWithCustomError(
      esc,
      'NotApproved'
    );

    await esc.approveMilestone(0);
    await expect(esc.connect(freelancer).releaseMilestone(0)).to.emit(esc, 'MilestoneReleased');

    await expect(esc.connect(freelancer).releaseMilestone(0)).to.be.revertedWithCustomError(
      esc,
      'AlreadyReleased'
    );
  });
});
