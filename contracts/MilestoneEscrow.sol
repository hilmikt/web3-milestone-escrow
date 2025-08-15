// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Milestone-based escrow between a client and a freelancer
/// @author Hilmi
/// @notice Client funds each milestone; freelancer can withdraw only after client approval
/// @dev Minimal, prototype-ready; uses pull-payments + simple reentrancy guard

contract MilestoneEscrow {
    // ---------- Errors ----------
    error NotClient();
    error NotFreelancer();
    error InvalidMilestone();
    error AlreadyReleased();
    error NotApproved();
    error AlreadyApproved();
    error ZeroAmount();
    error NotCancelable();

    // ---------- Events ----------
    event MilestoneCreated(uint256 indexed id, uint256 amount);
    event MilestoneFunded(uint256 indexed id, uint256 amount, address indexed from);
    event MilestoneApproved(uint256 indexed id, address indexed by);
    event MilestoneReleased(uint256 indexed id, uint256 amount, address indexed to);
    event MilestoneCanceled(uint256 indexed id, uint256 refunded);

    // ---------- Roles ----------
    address public immutable client;
    address public immutable freelancer;

    // ---------- State ----------
    struct Milestone {
        uint256 amount;     // expected funding (wei)
        uint256 balance;    // actually funded (wei)
        bool approved;      // client approved
        bool released;      // paid out to freelancer
    }
    Milestone[] public milestones;

    // ---------- Simple reentrancy guard ----------
    uint256 private _status;
    modifier nonReentrant() {
        require(_status == 0, "REENTRANCY");
        _status = 1;
        _;
        _status = 0;
    }

    // ---------- Modifiers ----------
    modifier onlyClient() {
        if (msg.sender != client) revert NotClient();
        _;
    }

    modifier onlyFreelancer() {
        if (msg.sender != freelancer) revert NotFreelancer();
        _;
    }

    // ---------- Constructor ----------
    /// @param _freelancer freelancer wallet to receive released funds
    constructor(address _freelancer) {
        require(_freelancer != address(0), "ZERO_FREELANCER");
        client = msg.sender;
        freelancer = _freelancer;
    }

    // ---------- Views ----------
    function milestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    // ---------- Mutations ----------
    /// @notice Create a milestone with an expected amount (in wei)
    /// @dev Only client. Not funded yet.
    function createMilestone(uint256 _amount) external onlyClient {
        if (_amount == 0) revert ZeroAmount();
        milestones.push(Milestone({amount: _amount, balance: 0, approved: false, released: false}));
        emit MilestoneCreated(milestones.length - 1, _amount);
    }

    /// @notice Fund a milestone with ETH; can be called multiple times until expected amount is met
    function fundMilestone(uint256 _id) external payable onlyClient {
        if (_id >= milestones.length) revert InvalidMilestone();
        if (msg.value == 0) revert ZeroAmount();
        Milestone storage m = milestones[_id];
        m.balance += msg.value;
        emit MilestoneFunded(_id, msg.value, msg.sender);
    }

    /// @notice Approve a milestone so the freelancer can withdraw
    function approveMilestone(uint256 _id) external onlyClient {
        if (_id >= milestones.length) revert InvalidMilestone();
        Milestone storage m = milestones[_id];
        if (m.approved) revert AlreadyApproved();
        m.approved = true;
        emit MilestoneApproved(_id, msg.sender);
    }

    /// @notice Freelancer withdraws funds for an approved milestone
    /// @dev Pull payment; protects against reentrancy
    function releaseMilestone(uint256 _id) external onlyFreelancer nonReentrant {
        if (_id >= milestones.length) revert InvalidMilestone();
        Milestone storage m = milestones[_id];
        if (!m.approved) revert NotApproved();
        if (m.released) revert AlreadyReleased();
        uint256 amount = m.balance;
        if (amount == 0) revert ZeroAmount();

        m.released = true;
        m.balance = 0;

        (bool ok, ) = payable(freelancer).call{value: amount}("");
        require(ok, "PAY_FAIL");
        emit MilestoneReleased(_id, amount, freelancer);
    }

    /// @notice Client can cancel and refund funds before approval/release
    function cancelMilestone(uint256 _id) external onlyClient nonReentrant {
        if (_id >= milestones.length) revert InvalidMilestone();
        Milestone storage m = milestones[_id];
        if (m.approved || m.released) revert NotCancelable();

        uint256 refund = m.balance;
        m.balance = 0;
        (bool ok, ) = payable(client).call{value: refund}("");
        require(ok, "REFUND_FAIL");

        emit MilestoneCanceled(_id, refund);
    }

    // Fallback to receive eth if needed
    receive() external payable {}
}
