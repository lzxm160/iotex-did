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
  deployer.deploy(IoTeXDID,str.getBytes(),0x0);
  // deployer.deploy(MockDeviceDID, CloudServiceAddr);
};
