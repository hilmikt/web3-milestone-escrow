// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

    /// @dev Base contract for milestone-based payments between a client and a freelancer.
    /// @notice Deploy this contract by specifying the freelancer address.

contract MilestoneEscrow {
    /// @notice Address of the client
    address public client;

    /// @notice Address of the freelancer
    address public freelancer;

    /// @notice Number of milestones created
    uint256 public milestoneCount;

    /// @dev Modifier to restrict actions to the freelancer
    modifier onlyClient() {
        require(msg.sender == client, "Not client");
        _;
    }

    /// @dev Modifier to restrict actions to the freelancer
    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Not freelancer");
        _;
    }

    /// @notice Constructor to set the freelancer address and client as deployer
    /// @param _freelancer Address of the freelancer
    constructor(address _freelancer) payable {
        client = msg.sender;
        freelancer = _freelancer;
    }

    /// @notice Represents a project milestone
    /// @param amount The agreed payment for this milestone in wei.
    /// @param approved Status indicating if the client approved the milestone.
    /// @param released Status indicating if the funds were released to the freelancer.

    struct Milestone {
        uint256 amount;
        bool approved;
        bool released;
    }

    /// @notice Mapping from milestone ID to Milestone data
    mapping (uint256 => Milestone) public milestones;

    /// @notice Creates a new milestone with a specified amount
    /// @dev Only the client can call this
    /// @param _amount Amount for this milestone in wei
    function createMilestone(uint256 _amount) external onlyClient {
        milestones[milestoneCount] = Milestone(_amount, false, false);
        milestoneCount++;
    }

}