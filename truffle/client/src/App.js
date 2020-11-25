import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: [], web3: null, accounts: null, contract: null, hasAccess: false, selectedVote: 0, isOwner: false, allCandidates: [[], [], []], allUsers: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });
    try {
      const hasAccess = await contract.methods.getUserVoteAccessInfo().call({ from: accounts[0] });
      this.setState({ hasAccess });
      if (hasAccess){
          // Get the value from the contract to prove it worked.
          const response = await contract.methods.viewAllCandidates().call({ from: accounts[0] });
          console.log('response', response);
  
          // If address already voted, get vote made
          const voteAlready = await contract.methods.getUserVotedInfo().call({ from: accounts[0] });
          console.log('voteAlready', voteAlready);
  
          // Update state with the result.
          this.setState({ storageValue: [response[0], response[1]], selectedVote: voteAlready[0] ? voteAlready[1] : false });
  
          const isOwner = await contract.methods.checkIsOwner().call({ from: accounts[0] });
          if (isOwner) {
            const allCandidates = await contract.methods.getAllCandidates().call({ from: accounts[0] });
            const allUsers = await contract.methods.getAllVoters().call({ from: accounts[0] });
            this.setState({ isOwner: true, allCandidates: [allCandidates[0], allCandidates[1], allCandidates[2]], allUsers });
          }
      }
    }
    catch(e){
      console.error(e);
    }
  };

  loadCandidates = async() => {
    const { accounts, contract, isOwner } = this.state;
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.viewAllCandidates().call({ from: accounts[0] });
        const allCandidates = isOwner ? await contract.methods.getAllCandidates().call({ from: accounts[0] }) : [[], [], []];
    
        // Update state with the result.
        this.setState({ storageValue: [response[0], response[1]], allCandidates: [allCandidates[0], allCandidates[1], allCandidates[2]] });
  }

  vote = async (_id, _name) => {
    const { accounts, contract } = this.state;
    if (window.confirm('Are you sure you want to vote for '+_name+'?')) {
      const votebut = document.getElementById('votebut'+_id);
      votebut.disabled = true;
      votebut.value = "Processing...";
      try {
        const voteReturn = await contract.methods.doVote(_id, _name).send({ from: accounts[0] });
  
        this.setState({ selectedVote: _id });
        this.loadCandidates();

      }
      catch(e) {
        alert("An error occurred placing your vote.");
        votebut.disabled = false;
        votebut.value = "Vote";

      }
    }
  }

  changeVisibility = async (_id, _visibility, _name, e) => {
    const { accounts, contract } = this.state;
    if (this.state.isOwner && window.confirm('Are you sure you want to change visibility for '+_name+'?')) {
      const actionbut = e.target;
      actionbut.disabled = true;
      actionbut.value = "Processing...";
      const actionReturn = await contract.methods.changeCandidateVisibility(_id, _visibility).send({ from: accounts[0] });
      if (!actionReturn) {
        alert("An error occurred placing your vote.");
      }
      else {
        this.loadCandidates();
        actionbut.disabled = false;
      }
    }
  }

  addCandidate = async () => {
    const { accounts, contract } = this.state;
    const name = document.getElementById("candidate-name");
    if (name.value == ''){
      alert("Enter a candidate name first")
      return false;
    }

    const actionbut = document.getElementById("candidate-button");
    actionbut.disabled = true;
    actionbut.value = "Processing...";
    const actionReturn = await contract.methods.addCandidate(name.value).send({ from: accounts[0] });
    if (!actionReturn) {
      alert("An error occurred adding candidate.");
    }
    else {
      this.loadCandidates();
      actionbut.disabled = false;
      name.value = '';
    }

  }

  addUser = async () => {
    const { accounts, contract } = this.state;
    const name = document.getElementById("user-name");
    const address = document.getElementById("user-address");
    if (name.value == ''){
      alert("Enter a user name")
      return false;
    }
    if (address.value == ''){
      alert("Enter the user's address")
      return false;
    }

    const actionbut = document.getElementById("user-button");
    actionbut.disabled = true;
    actionbut.value = "Processing...";
    const actionReturn = await contract.methods.addVoter(address.value, name.value).send({ from: accounts[0] });
    if (!actionReturn) {
      alert("An error occurred adding user.");
    }
    else {
      
      const allUsers = await contract.methods.getAllVoters().call({ from: accounts[0] });
      this.setState({ allUsers });
      actionbut.disabled = false;
      name.value='';
      address.value='';
    }

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (!this.state.hasAccess) {
      return <div><p className="noaccess">Your account is not allowed to vote.<br/><br/>address: {this.state.accounts[0]}</p></div>
    }
    return (
      <div className="App">
        <h4 className="connected">Connected: { this.state.accounts[0] } - {this.state.isOwner ? "owner" : "user"}</h4>
        <h1>Community App - Candidate Voting</h1>
        <h3>Select a candidate below<br/></h3>
        <div className="grid">
          {
            this.state.storageValue.length >0 ? this.state.storageValue[0].map((item, i)=>{
              if (item != "") 
                return (
              <div key={"candidate"+i} className="card"><h3 className="card-title">{item} - {this.state.storageValue[1][i]} vote{this.state.storageValue[1][i] != 1 ? 's' : ''}</h3>{this.state.selectedVote && this.state.selectedVote == i ? (<button className="voted-but">YOU VOTED FOR</button>) : this.state.selectedVote == 0 ? (<button id={"votebut"+i} className="vote-but" onClick={() => this.vote(i, item)}>Vote</button>) : (null)}</div>
            )}) : (null)
          }
        </div>

        {
          this.state.isOwner ? (

            <div className="admin-area">
              <div className="column">
                <h1>Candidate Administration</h1>
                <table className="candidates">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Votes</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.allCandidates[0].map((item,i)=>(
                      <tr key={i}>
                        <td>{item}</td>
                        <td>{this.state.allCandidates[2][i]}</td>
                        <td>{this.state.allCandidates[1][i] ? "Available" : "Closed"}</td>
                        <td>{this.state.allCandidates[1][i] ? <button onClick={(e) => this.changeVisibility(i, false, item, e)}>Turn OFF</button> : <button onClick={(e) => this.changeVisibility(i, true, item, e)}>Turn ON</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="form">
                  <input id="candidate-name" type="text" placeholder="Candidate Name" />
                  <button id="candidate-button" onClick={()=>this.addCandidate()}>ADD</button>
                </div>
              </div>
              <div className="column">
                <h1>User Administration</h1>
                <table className="users">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.allUsers.map((item,i)=>(
                      <tr key={i}>
                        <td>{item.voterName}</td>
                        <td>{item.voterAddress}</td>
                        {/* <td><button onClick={(e) => {}}>REVOKE</button></td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="form">
                  <input id="user-name" type="text" placeholder="User Name" />
                  <input id="user-address" type="text" placeholder="Address" />
                  <button id="user-button" onClick={()=>this.addUser()}>ADD</button>
                </div>
              </div>
          </div>
          ) : (null)
        }

      </div>
    );
  }
}

export default App;
