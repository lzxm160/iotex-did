const IoTeXDID = artifacts.require("UCamDIDManager.sol");

contract("UCamDIDManager", function (accounts) {
  String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };
  // console.log(bin2string("xx".getBytes()));
  beforeEach(async function () {
    // var str = "did:io:ucam";
    const zeroaddr = "0x0000000000000000000000000000000000000000";
    this.contract = await IoTeXDID.new(zeroaddr);
  });
  describe("create did", function () {
    it("success", async function (done) {
      let testHash = web3.utils.sha3("test");
      console.log("testHash", testHash);
      console.log(
        "this.contract.toLowerCase()",
        this.contract.address.toLowerCase()
      );
      console.log("accounts[0].toLowerCase()", accounts[0].toLowerCase());
      console.log("accounts[1].toLowerCase()", accounts[1].toLowerCase());
      let shortuid = accounts[1]
        .toLowerCase()
        .slice(2, accounts[1].toLowerCase().byteLength);
      console.log("shortuid", shortuid);

      let uri = "s3://iotex-did/documents";
      let did = "did:io:ucam:" + shortuid;
      // "I authorize ", addrToString(agent), " to create DID ", did, " in contract with ", addrToString(address(this)), " (", h, ", ", uri, ")"
      let msg =
        "I authorize " +
        accounts[0].toLowerCase() +
        " to create DID " +
        did +
        " in contract with " +
        this.contract.address.toLowerCase() +
        " (" +
        web3.utils.hexToBytes(testHash) +
        ", " +
        uri +
        ")";
      console.log(web3.utils.hexToBytes(testHash));
      console.log("msg", msg);
      let sig = await web3.eth.sign(msg, accounts[1]);
      console.log("sig", sig);

      let tx = await this.contract.createDIDByAgent(
        web3.utils.hexToBytes(accounts[1].toLowerCase()),
        web3.utils.hexToBytes(testHash),
        uri.getBytes(),
        accounts[1],
        web3.utils.hexToBytes(sig)
      );
      console.log();
      console.log();
      console.log();
      let alllogs = tx.receipt.rawLogs;
      for (var i = 0; i < alllogs.length; ++i) {
        console.log("alllogs", alllogs[i]);
      }
    });
  });
});
function bin2string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    console.log(array[i]);
    result += String.fromCharCode(array[i]);
  }
  return result;
}
// console.log("sig", sig.slice(2, sig.byteLength));
// let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
// console.log("prefix + msg", prefix + msg);

// let accounts = await web3.eth.getAccounts();
// let msgHash1 = web3.utils.sha3(prefix + msg);
