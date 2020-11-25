# Design Pattern Decisions

The goal of the contract is to allow authorized users to cast their vote for a candidate of their choice.  Thru a React frontend, the contract Owner can create candidates, show & hide those candidates and add addresses that are allowed to vote on a candidate.  Authorized addresses can access this frontend to place their vote.  A user can vote once per address.  

A mobile app was also created to extend the react application but via a native mobile app. WalletConnect seems to allow you to submit signed transactions thru another wallet app (ie metamask mobile) but there still seems more work to do in this area.  The app was created to show how you could use this Voting contract as a starting point to build an authorized community of individuals that use the blockchain.  This voting contract was the first POC but additional contracts could be extended in the app to provide further functionality.

The flow of the Contract was setup as:

- Create contract.  A set of default candidates initially loaded.  Contract owner also set as first user whom can vote.
- The admin can add additional addresses that can vote, as well as add additional candidates.  Candidates are saved on the blockchain, as well as any votes casted.  This solution may only scale to a certain amount before gas costs too much. Adding candidates, changing visibility and adding users will cost gas to the owner as this data is saved on the blockchain.
- Users can visit the React frontend to connect their wallet and if they authorized access, place a vote for their candidate.  
- Loading the mobile app, the user can connect their mobile wallet (ie Metamask mobile) and sign transactions.  Once connecting their wallet, the native app will work similar to the desktop app (in first checking their account access and then allowing the user to place a vote).

Design Pattern choices:

Choice 1:
Fail early and without throwing exceptions
1.  Within functions used modifiers that are run prior to the function executing.  This ensures proper user access before calling any method.
2.  Also using require conditions at the top of the functions. 

Choice 2:
Restricting Access using modifiers
1.  An onlyOwner modifer (provided by extended contract) is created that ensures admin functions (adding users & candidates) are only done by the contract owner.
2.  An onlyUsers modifer is created that ensures authorized users are able to make function calls returning data. 

Choice 3:
Circuit breakers
stopInEmergency modifier was added to both doVote and viewAllCandidates to stop any further voting/displaying candidates in case of bug.  Only contract owner can call method to change this variable (stopped).
Also a kill method was added in case the contract owner wants to destroy the contract from the blockchain.