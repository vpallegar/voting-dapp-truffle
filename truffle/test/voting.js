
let catchRevert = require("./exceptionsHelpers.js").catchRevert
var Voting = artifacts.require("./Voting.sol");

contract("Voting", accounts => {

  const owner = accounts[0];
  const testAddress = accounts[1];
  let catchRevert = require("./exceptionsHelpers.js").catchRevert;
  let instance;

  beforeEach(async () => {
    instance = await Voting.new()
  });

  it("should initialize the owner as first user", async () => {
    const accessInfo = await instance.getUserVoteAccessInfo.call();
    assert.equal(accessInfo, true, 'not returning getUserVoteAccessInfo = true');
  });

  it("should return i am the owner", async () => {
    const accessInfo = await instance.checkIsOwner.call();
    assert.equal(accessInfo, true, 'not returning correct owner');
  });

  it("shouldn't allow testaddress initial access", async () => {
    const accessInfo = await instance.getUserVoteAccessInfo({from : testAddress});
    assert.equal(accessInfo, false, 'user access should be false');
  });

  it("should add user", async () => {
    await instance.addVoter(testAddress, "New Person");

    const totalVoters = await instance.totalVoters.call();
    assert.equal(totalVoters, 2, 'totalVoters not reporting correctly, should be 2.')
  });

  it("should add candidate", async () => {
    await instance.addCandidate("New Candidate");

    const totalCandidates = await instance.totalCandidates.call();
    assert.equal(totalCandidates, 1, 'totalCandidates not reporting correctly, should be 1.')
  });

  it("shouldn't allow testaddress to add user", async () => {
    await catchRevert(instance.addVoter(accounts[0], "New Person", {from : testAddress}));
  });


  it("should change candidate visibility", async () => {
    await instance.addCandidate("New Candidate");
    await instance.addCandidate("New Candidate2");

    const candidate = await instance.changeCandidateVisibility(1, false);
    assert.equal(candidate.toString(), { id: 1, name: 'New Candidate2', voteCount: 0, open: false }, 'candidate visibility not updating')
  });

  it("should add vote for owner", async () => {

    await instance.addCandidate("New Candidate");
    await instance.addCandidate("John Doe");
    await instance.doVote(1, "John Doe");

    const totalVotes = await instance.totalVotes.call();
    assert.equal(totalVotes, 1, 'totalVotes not reporting correctly, should be 1.');

    const userInfo = await instance.getUserVotedInfo.call();
    assert.equal(userInfo[0], true, 'not showing user as marked as voted from getUserVotedInfo');
    assert.equal(userInfo[1], 1, 'not returning getUserVotedInfo correct choiceId after vote');


  });

  it("should get candidates", async () => {

    await instance.addCandidate("New Candidate");
    await instance.addCandidate("New Candidate 2");
    await instance.addCandidate("New Candidate 3");

    const candidates = await instance.viewAllCandidates.call();
    assert.equal(candidates[0].length, 3, 'not returning correct candidates length.  Should return 3.');

  });


  // Now lets do some tests for security

});
