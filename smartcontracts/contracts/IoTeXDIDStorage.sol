pragma solidity >=0.4.24 <=0.6.1;

contract IoTeXDIDStorage {
    string constant didPrefix = "did:io:";
    struct DID {
        bool exist;
        bytes32 hash;
        string uri;
    }
    mapping(string => DID) public dids;

    function generateDIDString() private view returns (string memory) {
        return string(abi.encodePacked(didPrefix, addrToString(msg.sender)));
    }

    function addrToString(address _addr) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(_addr));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function compareStrings (string a, string b) internal pure returns (bool memory) {
        return (keccak256(abi.encodePacked((toLower(a)))) == keccak256(abi.encodePacked((toLower(b)))));
    }

    function toLower(string str) internal pure returns (string memory) {
		bytes memory bStr = bytes(str);
		bytes memory bLower = new bytes(bStr.length);
		for (uint i = 0; i < bStr.length; i++) {
			if ((bStr[i] >= 65) && (bStr[i] <= 90)) {
				bLower[i] = bytes1(int(bStr[i]) + 32);
			} else {
				bLower[i] = bStr[i];
			}
		}
		return string(bLower);
	}
}
