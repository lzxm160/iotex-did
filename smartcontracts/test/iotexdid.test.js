const IoTeXDID = artifacts.require("UCamDIDManager.sol");

contract("UCamDIDManager", function (accounts) {
  String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };
  beforeEach(async function () {
    // var str = "did:io:ucam";
    const zeroaddr = "0x0000000000000000000000000000000000000000";
    this.contract = await IoTeXDID.new(zeroaddr);
  });
  describe("create did", function () {
    it("success", async function () {
      let testHash = web3.utils.sha3("test");
      console.log("testHash", testHash);
      console.log(
        "this.contract.toLowerCase()",
        this.contract.address.toLowerCase()
      );
      let uri = "s3://iotex-did/documents";
      let did = "did:io:ucam:" + accounts[1].toLowerCase();
      // "I authorize ", addrToString(agent), " to create DID ", did, " in contract with ", addrToString(address(this)), " (", h, ", ", uri, ")"
      let msg =
        "I authorize " +
        accounts[0].toLowerCase() +
        " to create DID " +
        did +
        " in contract with " +
        this.contract.address.toLowerCase() +
        " (" +
        testHash.slice(2, testHash.byteLength) +
        ", " +
        uri +
        ")";
      let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
      console.log("prefix + msg", prefix + msg);

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
      console.log("accounts[0].toLowerCase()", accounts[0].toLowerCase());
      console.log("accounts[1].toLowerCase()", accounts[1].toLowerCase());

      console.log("sig", sig.slice(2, sig.byteLength));
      await this.contract.createDIDByAgent(
        accounts[1].toLowerCase(),
        web3.utils.hexToBytes(testHash),
        uri.getBytes(),
        accounts[0].toLowerCase(),
        web3.utils.hexToBytes(sig.slice(2, sig.byteLength))
      );
    });
  });
});
