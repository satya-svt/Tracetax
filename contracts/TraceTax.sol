// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TraceTax is Ownable {
    struct Project {
        string name;
        uint256 budget;
        uint256 spent;
        address contractor;
        bool active;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => bool) public verifiedDIDs; // ACB-verified identities
    
    event FundReleased(uint256 indexed projectId, address indexed to, uint256 amount);
    event CorruptionFlag(address indexed suspiciousAddress, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // ACB (Owner) verifies identities for the ecosystem
    function verifyIdentity(address _account) external onlyOwner {
        verifiedDIDs[_account] = true;
    }

    // Government creates a project with a fixed budget
    function initializeProject(uint256 _id, string memory _name, uint256 _budget, address _contractor) external onlyOwner {
        require(verifiedDIDs[_contractor], "Contractor DID not verified by ACB");
        projects[_id] = Project(_name, _budget, 0, _contractor, true);
    }

    // The "Anti-Corruption" Gatekeeper: Only releases funds to verified DIDs
    function releasePayment(uint256 _projectId, uint256 _amount) external onlyOwner {
        Project storage p = projects[_projectId];
        require(p.active, "Project is not active");
        require(p.spent + _amount <= p.budget, "Budget exceeded!");

        if (verifiedDIDs[p.contractor]) {
            p.spent += _amount;
            (bool success, ) = payable(p.contractor).call{value: _amount}("");
            require(success, "Transfer failed");
            emit FundReleased(_projectId, p.contractor, _amount);
        } else {
            // If the DID was revoked or is invalid, the funds are frozen
            emit CorruptionFlag(p.contractor, _amount);
            revert("Blocked: Target identity is not verified by ACB!");
        }
    }

    // Function to receive tax funds into the treasury
    receive() external payable {}
}