const Migrations = artifacts.require("Migrations");
const IoTeXDID = artifacts.require("UCamDIDManager");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  // String.prototype.getBytes = function () {
  //   var bytes = [];
  //   for (var i = 0; i < this.length; ++i) {
  //     bytes.push(this.charCodeAt(i));
  //   }
  //   return bytes;
  // };
  // var str = "did:io:";str.getBytes(),
  const zeroaddr = "0x0000000000000000000000000000000000000000";
  deployer.deploy(IoTeXDID, zeroaddr);
};
