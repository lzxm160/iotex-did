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
      // let shortuid = accounts[1]
      //   .toLowerCase()
      //   .slice(2, accounts[1].toLowerCase().byteLength);
      // console.log("shortuid", shortuid);

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
        web3.utils.hexToBytes(testHash) +
        // testHash +
        ", " +
        uri +
        ")";
      console.log(web3.utils.hexToBytes(testHash));
      console.log("msg", msg);
      console.log("uri asciiToHex", web3.utils.asciiToHex(uri));
      console.log(
        "uri hexToBytes",
        web3.utils.hexToBytes(web3.utils.asciiToHex(uri))
      );
      let sig = await web3.eth.sign(msg, accounts[1]);
      console.log("sig", sig);
      console.log();
      console.log();
      console.log();
      let tx = await this.contract
        .createDIDByAgent(
          web3.utils.hexToBytes(accounts[1]),
          web3.utils.hexToBytes(testHash),
          web3.utils.hexToBytes(web3.utils.asciiToHex(uri)),
          web3.utils.hexToBytes(accounts[1]),
          web3.utils.hexToBytes(sig)
        )
        .on("receipt", function (receipt) {
          console.log("receipt");
          console.log(receipt); // contains the new contract address
        })
        // .on("error", function (error, receipt) {
        // console.log("//////////////////////////////error");
        // console.log(error);
        // console.log("receipt", receipt);
        // })
        .catch(function (error) {
          console.log("catch", error);
        });
      // this.contract
      //   .getPastEvents(
      //     "authMsg",
      //     {
      //       filter: {},
      //       fromBlock: 0,
      //       toBlock: "latest",
      //     },
      //     function (error, events) {
      //       console.log(events);
      //     }
      //   )
      //   .then(function (events) {
      //     console.log(events); // same results as the optional callback above
      //   });
    });
  });
});
function unpack(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xff);
  }
  return bytes;
}
// let alllogs = tx.receipt.log;
// for (var i = 0; i < alllogs.length; ++i) {
//   console.log("alllogs", alllogs[i]);
// }
// .then(function (receipt) {
//   console.log("then............");
//   console.log(receipt); // contains the new contract address
// });
// let alllogs = tx.log;
// for (var i = 0; i < alllogs.length; ++i) {
//   console.log("alllogs", alllogs[i]);
// }
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
