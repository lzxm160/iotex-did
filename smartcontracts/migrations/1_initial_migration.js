const Migrations = artifacts.require("Migrations");
const DecentralizedIdentifier = artifacts.require("DeviceDecentralizedIdentifier");
const IoTeXDID = artifacts.require("AddressBasedDIDManagerWithAgentEnabled");
const MockDeviceDID = artifacts.require("MockDeviceDID");
const CloudServiceAddr = "0x627306090abab3a6e1400e9345bc60c78a8bef57";

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  // deployer.deploy(DecentralizedIdentifier);
  String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };
  var str = "did:io:";
  const zeroaddr = "0x0000000000000000000000000000000000000000"
  deployer.deploy(IoTeXDID,str.getBytes(),zeroaddr);
  // deployer.deploy(MockDeviceDID, CloudServiceAddr);
};
