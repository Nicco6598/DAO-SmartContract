// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dao is Ownable {
    IERC20 public token;
    uint256 public tokenPrice;
    bool public saleIsActive = true;

    struct Proposal {
        string title;
        string description;
        uint256 voteCountYes;
        uint256 voteCountNo;
        uint256 voteCountAbstain;
        uint256 deadline;
        bool executed;
        address payable recipient;
        uint256 amount;
        mapping(address => bool) voted;
    }

    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public shares;
    mapping(address => address) public delegateTo;

    event ProposalCreated(uint256 indexed proposalId, string title, string description, address recipient, uint256 amount);
    event VoteCasted(address indexed voter, uint256 indexed proposalId, bool voteYes, bool abstain);
    event ProposalExecuted(uint256 indexed proposalId, bool successful);

    constructor(address _token, uint256 _tokenPrice) {
        token = IERC20(_token);
        tokenPrice = _tokenPrice;
    }

    function buyShares(uint256 _amount) public {
        require(saleIsActive, "Sale has ended");
        uint256 cost = _amount * tokenPrice;
        require(token.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        shares[msg.sender] += _amount;
    }

    function endSale() public onlyOwner {
        saleIsActive = false;
    }

    function createProposal(string memory _title, string memory _description, address payable _recipient, uint256 _amount) public {
        require(shares[msg.sender] > 0, "Must own shares to propose");

        Proposal storage proposal = proposals[nextProposalId++];
        proposal.title = _title;
        proposal.description = _description;
        proposal.recipient = _recipient;
        proposal.amount = _amount;
        proposal.deadline = block.timestamp + 1 weeks; // 1 week to vote

        emit ProposalCreated(nextProposalId - 1, _title, _description, _recipient, _amount);
    }

    function vote(uint256 _proposalId, bool _voteYes, bool _abstain) public {
        require(shares[msg.sender] > 0, "Must own shares to vote");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline, "Voting period has ended");
        require(!proposal.voted[msg.sender], "Already voted");

        proposal.voted[msg.sender] = true;
        if (_abstain) {
            proposal.voteCountAbstain += shares[msg.sender];
        } else if(_voteYes) {
            proposal.voteCountYes += shares[msg.sender];
        } else {
            proposal.voteCountNo += shares[msg.sender];
        }

        emit VoteCasted(msg.sender, _proposalId, _voteYes, _abstain);
    }

    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline, "Voting period has not ended");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;
        if(proposal.voteCountYes > proposal.voteCountNo) {
            require(token.transfer(proposal.recipient, proposal.amount), "Transfer failed");
            emit ProposalExecuted(_proposalId, true);
        } else {
            emit ProposalExecuted(_proposalId, false);
        }
    }
}
