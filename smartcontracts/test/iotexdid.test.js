const IoTeXDID = artifacts.require(
  "AddressBasedDIDManagerWithAgentEnabled.sol"
);

contract("AddressBasedDIDManagerWithAgentEnabled", function (accounts) {
  beforeEach(async function () {
    var str = "did:io:";
    const zeroaddr = "0x0000000000000000000000000000000000000000";
    this.contract = await IoTeXDID.new(str.getBytes(), zeroaddr);
  });
  describe("create did", function () {
    it("success", async function () {
      let hash = web3.utils.fromAscii("hash");
      let uri = "s3://iotex-did/documents";
      let did = "did:io:" + accounts[1].toLowerCase();
      let msg =
        "I authorize," +
        accounts[0].toLowerCase() +
        " to create DID " +
        did +
        " in contract with " +
        this.contract +
        " (" +
        h +
        ", " +
        uri +
        ")";
      // I authorize ", addrToString(agent), " to create DID ", did, " in contract with ", addrToString(address(this)), " (", h, ", ", uri, ")"
      let prefix = "\x19Ethereum Signed Message:\\n" + msg.length;
      console.log(prefix + msg);
      let sig = await web3.eth.accounts.sign(
        prefix + msg,
        accounts[1].privateKey
      );

      sig = sig.signature;
      console.log(sig);

      await this.contract.registerByAgent(
        hash,
        uri,
        accounts[1].toLowerCase(),
        sig
      );
    });
  });
});
