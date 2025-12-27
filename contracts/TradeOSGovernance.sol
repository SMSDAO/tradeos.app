// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeOSGovernance {
    struct Proposal {
        uint256 id;
        string title;
        uint256 votes;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    event ProposalCreated(uint256 id, string title);
    event Voted(uint256 id, uint256 newVotes);

    function createProposal(string calldata title) external {
        proposals[nextProposalId] = Proposal(nextProposalId, title, 0);
        emit ProposalCreated(nextProposalId, title);
        nextProposalId++;
    }

    function vote(uint256 id) external {
        require(bytes(proposals[id].title).length > 0, "Proposal does not exist");
        proposals[id].votes++;
        emit Voted(id, proposals[id].votes);
    }

    function getProposal(uint256 id) external view returns (string memory title, uint256 votes) {
        Proposal memory p = proposals[id];
        return (p.title, p.votes);
    }
}
