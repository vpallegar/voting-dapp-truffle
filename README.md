# Community DApp

![Image of DApp]
(https://www.dropbox.com/s/lbsj0zpjxyaesy1/Screen%20Shot%202020-11-24%20at%207.21.31%20PM.png?raw=1)

## truffle
Within the truffle folder you will see: 
- `client`: this contains the React frontend code.
- `contracts`: this contains the project contracts
- `migrations`: migration scripts for deploying
- `test`: unit tests for the contract

*Note: Please ensure you are running solidity@6 (`brew install solidity@6` for mac users). Contracts require ^0.6.0 to compile.

To get started with the contracts:

1. Run `truffle compile` to ensure your contracts properly compile.
2. Run `truffle test` to ensure your unit tests pass.
3. Start your ganache gui or ganache cli - `ganache-cli`.
4. Run `truffle migrate` to deploy the contracts on to your local blockchain. (Wait upto 30seconds to ensure your local blockchains updates and contract deployed )
5. Start react app by typing `cd client` && `npm install` && `npm run start`.  You will be redirect to a local dev server, http://localhost:3000
6. Now grab the account address ganache set as the owner of the contract (the first account in the list). With that address and private key add to your metamask wallet and ensure you use this account when connecting to the webapp. * Note: Add atleast the first account (contract owner) and secondary address so you can test how users will interact with frontend).

Once the DApp loads, after connecting your MM account you will be presented with the current Candidates available (which will be empty to start), as well as the Administration tools only available to the owner (Adding candidates / adding addresses).  You can also turn candidates on/off.  Toggling this visibility will hide them from the frontend but still keeps their record in the full list. 

Add your secondary address as another user and switch your metamask wallet to that account.  Refresh page and will now be interacting as a user.


### Testnet - Help guide: https://forum.openzeppelin.com/t/connecting-to-public-test-networks-with-truffle/2960
To deploy the contract to ropsten network, first get a projectID from infura.com.  Then in the truffle folder create a `secrets.json` file with to items: mnemonic & projectId. Enter your mnemonic phrase and your infura project id. (`npx mnemonics` to install a package to generate a phrase for you)
{
    "mnemonic": "planet auto sign choice ...",
    "projectId": "305c137050..."
}
Test Connection:
- `npx truffle console --network ropsten`
- `await web3.eth.getAccounts()`
- `await web3.eth.getBalance('0x0000000000000000000000')` (change address to first reported address from getAccounts method)

Get some ether for your address: https://faucet.ropsten.be/

Deploy contract to ropsten: `npx truffle migrate --network ropsten`
