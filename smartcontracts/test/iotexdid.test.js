const IoTeXDID = artifacts.require('AddressBasedDIDManagerWithAgentEnabled.sol');

contract('AddressBasedDIDManagerWithAgentEnabled', function(accounts) {
    beforeEach(async function() {
        this.contract = await IoTeXDID.new();
    });
    describe("create did", function () {
        it('success', async function() {
            let hash = web3.utils.fromAscii("hash");
            let uri = "s3://iotex-did/documents";
            let msg = 'I authorize' + accounts[0].toLowerCase() + ' to register ' + UUID;
            console.log(msg);
            let sig = await web3.eth.accounts.sign(msg, '0x1cd94a139f784fea91aee5a77b2519ab5852348a4525df12db2ef002d922e1e7');

            sig = sig.signature;
            console.log(sig);

            await this.contract.createDID(UUID, sig, hash, uri, {from: accounts[0]});
        })
    })
})