# Avoiding Common Attacks

Reentrance:
Upon voting, check condition to ensure they have not already voted otherwise. This is done first upon saving a vote to ensure if the user tried resubmitting another vote they wouldnt be able to.

Timestamp Dependency:
Not relying on any type of timestamp from the block due to miner's being able to manipulate this.

Poison Data:
Within any function that accepts data, ensure data is properly checked for accepted values.  This includes sending a candidate ID to ensure they dont try to send Id's of items that dont exist or not open.  

Tx origin:
Ensure always uses msg.sender when checking the user's address.  This ensures this address is not manipulated.

Test gas costs:

Gas Costs:
All strings have a max length of 255 characters (validated during entry).


MythX:
Ran a MyX job to analyze the Voting contract.
Report for Voting.sol

