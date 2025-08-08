// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

    @title MilestoneEscrow
    @dev Base contract for milestone-based payments between a client and a freelancer.
    @notice Deploy this contract by specifying the freelancer address.

contract MilestoneEscrow {
    /// @notice Address of the client
    address public client;

    /// @notice Address of the freelancer
    address public freelancer;

    /// @notice Number of milestones created
    uint256 public milestoneCount;

    /// @dev Modifier to restrict actions to the client
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

}