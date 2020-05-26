pragma solidity 0.4.24;
import "./IoTeXDIDStorage.sol";
import "./ownership/Ownable.sol";
contract IoTeXDIDProxy is IoTeXDIDStorage,Ownable {
    bool public isInitialized;
    // version=>contract address
    mapping(string => address) internal _versions;
    // version list
    string[] public versionList;
    // current version
    string public version;
    event Upgraded(string indexed newVersion, address indexed newImplementation);

    constructor(address logic_) public {
        initialize(logic_);
    }

    function initialize(address logic_) onlyOwner external {
        require(!isInitialized, "Account: has already initialized");
        upgradeTo("0.0.1", logic_);
        isInitialized = true;
    }

    function implementation() public view returns (address) {
        return _versions[version];
    }

    function upgradeTo(string memory _newVersion, address _newImplementation) public onlyOwner {
        require(implementation() != _newImplementation && _newImplementation != address(0), "Old address is not allowed and implementation address should not be 0x");
        require(isContract(_newImplementation), "Cannot set a proxy implementation to a non-contract address");
        require(bytes(_newVersion).length > 0, "Version should not be empty string");
        version = _newVersion;
        _versions[version] = _newImplementation;
        versionList.push(_newVersion);
        emit Upgraded(_newVersion, _newImplementation);
    }

    function getImplFromVersion(string calldata _version) external  view onlyOwner returns(address) {
        require(bytes(_version).length > 0, "Version should not be empty string");
        return _versions[_version];
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

    // fallback
    function () payable external {
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
