const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MilestoneEscrow", function () {
  let MilestoneEscrow, escrow, owner, client, freelancer;

  beforeEach(async function () {
    [owner, client, freelancer] = await ethers.getSigners();
    MilestoneEscrow = await ethers.getContractFactory("MilestoneEscrow");
    escrow = await MilestoneEscrow.deploy();
    await escrow.deployed();
  });

  /**
   * @notice Tests the creation of a new project with milestones
   */
  it("Should allow client to create a project with milestones", async function () {
    const milestoneAmount = ethers.utils.parseEther("1");
    await expect(
      escrow.connect(client).createProject(freelancer.address, [milestoneAmount], {
        value: milestoneAmount,
      })
    )
      .to.emit(escrow, "ProjectCreated")
      .withArgs(1, client.address, freelancer.address);

    const project = await escrow.projects(1);
    expect(project.client).to.equal(client.address);
    expect(project.freelancer).to.equal(freelancer.address);
  });

  /**
   * @notice Tests milestone approval and withdrawal request flow
   */
  it("Should allow client to approve a milestone and freelancer to request withdrawal", async function () {
    const milestoneAmount = ethers.utils.parseEther("1");
    await escrow.connect(client).createProject(freelancer.address, [milestoneAmount], {
      value: milestoneAmount,
    });

    await expect(escrow.connect(client).approveMilestone(1, 0))
      .to.emit(escrow, "MilestoneApproved")
      .withArgs(1, 0);

    await expect(escrow.connect(freelancer).requestWithdrawal(1, 0))
      .to.emit(escrow, "WithdrawalRequested")
      .withArgs(1, 0);
  });

  /**
   * @notice Tests that only the client can approve milestones
   */
  it("Should prevent non-client from approving milestones", async function () {
    const milestoneAmount = ethers.utils.parseEther("1");
    await escrow.connect(client).createProject(freelancer.address, [milestoneAmount], {
      value: milestoneAmount,
    });

    await expect(
      escrow.connect(freelancer).approveMilestone(1, 0)
    ).to.be.revertedWith("Only client can approve");
  });

  /**
   * @notice Tests full withdrawal flow after approval
   */
  it("Should allow freelancer to withdraw after approval", async function () {
    const milestoneAmount = ethers.utils.parseEther("1");
    await escrow.connect(client).createProject(freelancer.address, [milestoneAmount], {
      value: milestoneAmount,
    });

    await escrow.connect(client).approveMilestone(1, 0);
    await escrow.connect(freelancer).requestWithdrawal(1, 0);

    const initialBalance = await ethers.provider.getBalance(freelancer.address);

    await expect(escrow.connect(freelancer).withdraw(1, 0))
      .to.emit(escrow, "WithdrawalCompleted")
      .withArgs(1, 0);

    const finalBalance = await ethers.provider.getBalance(freelancer.address);
    expect(finalBalance).to.be.gt(initialBalance);
  });
});
