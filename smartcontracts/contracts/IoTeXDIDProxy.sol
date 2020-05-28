pragma solidity >=0.4.24 <=0.5.16;

import "./IoTeXDIDStorage.sol";
import "./ownership/Ownable.sol";

contract IoTeXDIDProxy is IoTeXDIDStorage,Ownable {
    // version=>contract address
    mapping(string => address) public allVersions;
    // version list
    string[] public versionList;
    // current version
    string public currentVersion;
    event Upgraded(string newVersion, address newImplementation);

    constructor(address logic) public {
        upgradeTo("0.0.1", logic);
    }

    function implementation() public view returns (address) {
        return allVersions[currentVersion];
    }

    function upgradeTo(string memory newVersion, address newImplementation) public onlyOwner {
        require(implementation() != newImplementation && newImplementation != address(0), "Old address is not allowed and implementation address should not be 0x");
        require(isContract(newImplementation), "Cannot set a proxy implementation to a non-contract address");
        require(bytes(newVersion).length > 0, "Version should not be empty string");
        currentVersion = newVersion;
        allVersions[currentVersion] = newImplementation;
        versionList.push(currentVersion);
        emit Upgraded(newVersion, newImplementation);
    }

    function getImplFromVersion(string memory _version) public view onlyOwner returns(address) {
        require(bytes(_version).length > 0, "Version should not be empty string");
        return allVersions[_version];
    }

    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    function() payable external {
        address _impl = implementation();
        require(_impl != address(0), "implementation not set");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _impl, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
