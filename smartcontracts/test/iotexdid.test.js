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
    const zeroaddr = "0x0000000000000000000000000000000000000000";
    this.contract = await IoTeXDID.new(zeroaddr);
    var didmsg = this.contract.didmsg({}, { fromBlock: 0, toBlock: "latest" });
    didmsg.watch(function (error, result) {
      console.log(error);
      console.log(result);
    });
    var reg = this.contract.reg({}, { fromBlock: 0, toBlock: "latest" });
    reg.watch(function (error, result) {
      console.log(error);
      console.log(result);
    });
    var hash = this.contract.hash({}, { fromBlock: 0, toBlock: "latest" });
    hash.watch(function (error, result) {
      console.log(error);
      console.log(result);
    });
    var authMsg = this.contract.authMsg(
      {},
      { fromBlock: 0, toBlock: "latest" }
    );
    authMsg.watch(function (error, result) {
      console.log(error);
      console.log(result);
    });
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
      let did = "did:io:ucam:" + accounts[1];
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
      console.log();
      console.log();
      console.log();
      let tx = await this.contract
        .createDIDByAgent(
          accounts[1],
          web3.utils.hexToBytes(testHash),
          uri.getBytes(),
          accounts[1],
          web3.utils.hexToBytes(sig)
        )
        .on("receipt", function (receipt) {
          console.log("receipt");
          console.log(receipt); // contains the new contract address
        })
        .on("error", function (error, receipt) {
          console.log("//////////////////////////////error");
          // console.log(error);
          console.log("receipt", receipt);
        })
        .catch(function (error) {
          console.log("catch", error);
        });

      // .then(function (receipt) {
      //   console.log("then............");
      //   console.log(receipt); // contains the new contract address
      // });
      // let alllogs = tx.log;
      // for (var i = 0; i < alllogs.length; ++i) {
      //   console.log("alllogs", alllogs[i]);
      // }
    });
  });
});
// function bin2string(array) {
//   var result = "";
//   for (var i = 0; i < array.length; ++i) {
//     console.log(array[i]);
//     result += String.fromCharCode(array[i]);
//   }
//   return result;
// }
// console.log("sig", sig.slice(2, sig.byteLength));
// let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
// console.log("prefix + msg", prefix + msg);

// let accounts = await web3.eth.getAccounts();
// let msgHash1 = web3.utils.sha3(prefix + msg);
// function () {
//   let alllogs = tx.receipt.log;
//   for (var i = 0; i < alllogs.length; ++i) {
//     console.log("alllogs", alllogs[i]);
//   }
//   this.contract
//       .getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" })
//       .then(console.log);
// }
