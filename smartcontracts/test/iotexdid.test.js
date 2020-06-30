const IoTeXDID = artifacts.require(
  "AddressBasedDIDManagerWithAgentEnabled.sol"
);

contract("AddressBasedDIDManagerWithAgentEnabled", function (accounts) {
  String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };
  beforeEach(async function () {
    var str = "did:io:";
    const zeroaddr = "0x0000000000000000000000000000000000000000";
    this.contract = await IoTeXDID.new(str.getBytes(), zeroaddr);
  });
  describe("create did", function () {
    it("success", async function () {
      // let hash = 0x414efa99dfac6f4095d6954713fb0085268d400d6a05a8ae8a69b5b1c10b4bed;
      let testHash = web3.utils.sha3("test");
      console.log(testHash);
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
        testHash.getBytes() +
        ", " +
        uri +
        ")";
      // I authorize ", addrToString(agent), " to create DID ", did, " in contract with ", addrToString(address(this)), " (", h, ", ", uri, ")"
      let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
      console.log(prefix + msg);

      // let accounts = await web3.eth.getAccounts();
      // let msgHash1 = web3.utils.sha3(prefix + msg);

      let sig = await web3.eth.sign(msg, accounts[1]);
      console.log("sig", sig);
      // let privateKey =
      //   "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
      //
      // let sigObj = await web3.eth.accounts.sign(msg, privateKey);
      // let msgHash2 = sigObj.messageHash;
      //
      // let sig2 = sigObj.signature;
      //
      // let sig = await web3.eth.accounts.sign(
      //   prefix + msg,
      //   accounts[1].privateKey
      // );

      // let sigs = sig.signature;
      // console.log("sigs", sigs);

      await this.contract.registerByAgent(
        testHash,
        uri.getBytes(),
        accounts[1].toLowerCase(),
        sig.slice(2, sig.byteLength)
      );
    });
  });
});
