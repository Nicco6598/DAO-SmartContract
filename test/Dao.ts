import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAO Contract Tests", function () {
  let dao, token;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy del token ERC20 usato per acquistare azioni della DAO
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("DAOToken", "DT", ethers.utils.parseEther("10000"));

    // Deploy del contratto DAO con il token come metodo di pagamento per le azioni
    const DAO = await ethers.getContractFactory("DAO");
    dao = await DAO.deploy(token.address, ethers.utils.parseUnits("1", "ether"));

    // Assegna token agli utenti per test
    await token.transfer(addr1.address, ethers.utils.parseEther("100"));
    await token.transfer(addr2.address, ethers.utils.parseEther("100"));

    // Approvazione del trasferimento dei token al contratto DAO per l'acquisto di azioni
    await token.connect(addr1).approve(dao.address, ethers.utils.parseEther("100"));
    await token.connect(addr2).approve(dao.address, ethers.utils.parseEther("100"));
  });

  it("Should allow users to buy shares and become DAO members", async function () {
    await dao.connect(addr1).buyShares(10);
    expect(await dao.shares(addr1.address)).to.equal(10);
  });

  it("Should allow members to propose decisions", async function () {
    await dao.connect(addr1).buyShares(10);
    await dao.connect(addr1).createProposal("Proposal 1", "Description 1", addr2.address, 100);
    const proposal = await dao.proposals(0);
    expect(proposal.title).to.equal("Proposal 1");
  });

  it("Should correctly tally votes based on share ownership", async function () {
    await dao.connect(addr1).buyShares(10);
    await dao.connect(addr2).buyShares(20);
    await dao.connect(addr1).createProposal("Proposal 2", "Description 2", addr2.address, 100);
    await dao.connect(addr1).vote(0, true, false);
    await dao.connect(addr2).vote(0, false, false);
    const proposal = await dao.proposals(0);
    expect(proposal.voteCountYes).to.equal(10);
    expect(proposal.voteCountNo).to.equal(20);
  });

  it("Should execute a decision if it has majority of yes votes", async function () {
    await dao.connect(addr1).buyShares(30);
    await dao.connect(addr2).buyShares(10);
    await dao.connect(addr1).createProposal("Proposal 3", "Description 3", addr2.address, 100);
    await dao.connect(addr1).vote(0, true, false);
    // Simula l'attesa per il superamento del periodo di votazione
    await new Promise(r => setTimeout(r, 2000)); // Piccola attesa per il blocco di tempo
    await dao.connect(addr1).executeProposal(0);
    const proposal = await dao.proposals(0);
    expect(proposal.executed).to.be.true;
  });

  it("Should not allow voting without owning shares", async function () {
    await expect(dao.connect(addr1).vote(0, true, false)).to.be.revertedWith("Must own shares to vote");
  });
});
