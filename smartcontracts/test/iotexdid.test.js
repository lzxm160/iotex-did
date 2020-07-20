const IoTeXDID = artifacts.require("UCamDIDManager.sol");

contract("UCamDIDManager", function (accounts) {
  beforeEach(async function () {
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
      console.log("accounts[0].toLowerCase()", accounts[0].toLowerCase());
      console.log("accounts[1].toLowerCase()", accounts[1].toLowerCase());

      let uri = "s3://iotex-did/documents";
      let uid = "E7UAA51MKZVCSH6GYHRJ";
      let did = "did:io:ucam:" + uid;
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
      let privateKey =
        "0x91eee7d89cc6959334e789bd986622cd1fafe9ddaff1b0fc064e48e846764fdb";
      let sigObj = await web3.eth.accounts.sign(msg, privateKey);
      sig = sigObj.signature;
      // let sig = await web3.eth.sign(msg, accounts[1]);
      console.log("sig", sig);
      console.log();
      console.log();
      console.log();
      let tx = await this.contract
        .createDIDByAgent(
          web3.utils.hexToBytes(uid),
          web3.utils.hexToBytes(testHash),
          web3.utils.hexToBytes(web3.utils.asciiToHex(uri)),
          accounts[1],
          web3.utils.hexToBytes(sig)
        )
        .on("receipt", function (receipt) {
          console.log("receipt");
          console.log(receipt.rawLogs); // contains the new contract address
        });
      // .catch(function (error) {
      //   console.log("catch", error);
      // });
    });
    it("sign test", async function () {
      // Using eth.sign()
      // var Web3 = require("web3");
      // var web3 = new Web3("http://192.168.1.5:7545");
      // let accounts = await web3.eth.getAccounts();
      let msg =
        "I authorize 0x9de29a2918d0b5e6c8e659bdae5a10752e25e664 to create DID did:io:ucam:0xb9ff6ab262b88b1609fa75ae1703915a2f949cf4 in contract with 0xc4ad7b5be992d04b144a963234dbadbff1b3155c (" +
        web3.utils.hexToBytes(web3.utils.sha3("test")) +
        ", s3://iotex-did/documents)";

      let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
      let msgHash1 = web3.utils.sha3(prefix + msg);

      let sig1 = await web3.eth.sign(msg, accounts[1]);

      console.log("accounts[1]", accounts[1]);
      console.log("msgHash1", msgHash1);
      console.log("sig1", sig1);
      // Using eth.accounts.sign() - returns an object

      let privateKey =
        "0x91eee7d89cc6959334e789bd986622cd1fafe9ddaff1b0fc064e48e846764fdb";

      let sigObj = await web3.eth.accounts.sign(msg, privateKey);
      let msgHash2 = sigObj.messageHash;

      let sig2 = sigObj.signature;
      console.log("msgHash2", msgHash2);
      console.log("sig2", sig2);
      let whoSigned1 = await web3.eth.accounts.recover(msg, sig1);
      let whoSigned2 = await web3.eth.accounts.recover(sigObj);
      console.log("whoSigned1", whoSigned1);
      console.log("whoSigned2", whoSigned2);
    });
  });
});

// let testsig = await web3.eth.sign("msg", accounts[1]);
// console.log("testsig", testsig);
// web3.eth.personal.ecRecover("msg", testsig).then(console.log);

// let shortuid = accounts[1]
//   .toLowerCase()
//   .slice(2, accounts[1].toLowerCase().byteLength);
// console.log("shortuid", shortuid);

// String.prototype.getBytes = function () {
//   var bytes = [];
//   for (var i = 0; i < this.length; ++i) {
//     bytes.push(this.charCodeAt(i));
//   }
//   return bytes;
// };
// .on("error", function (error, receipt) {
// console.log("//////////////////////////////error");
// console.log(error);
// console.log("receipt", receipt);
// })
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

// function unpack(str) {
//   var bytes = [];
//   for (var i = 0; i < str.length; i++) {
//     var char = str.charCodeAt(i);
//     bytes.push(char >>> 8);
//     bytes.push(char & 0xff);
//   }
//   return bytes;
// }
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
