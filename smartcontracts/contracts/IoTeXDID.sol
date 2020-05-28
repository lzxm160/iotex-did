pragma solidity >=0.4.24 <0.6.0;

import "./IoTeXDIDStorage.sol";

contract IoTeXDID is IoTeXDIDStorage{
    modifier onlyDIDOwner(string didInput) {
        string memory didString = generateDIDString();
        if (bytes(didInput).length > 0) {
            require(compareStrings(didInput, didString), "caller does not own the given did");
        }
        require(dids[didString].exist, "caller is not a did owner");
        _;
    }

    event CreateDID(string indexed id, string didString);
    event UpdateHash(string indexed didString, bytes32 hash);
    event UpdateURI(string indexed didString, string uri);
    event DeleteDID(string indexed didString);

    function createDID(string id, bytes32 hash, string uri) public {
        if (bytes(id).length > 0) {
            require(compareStrings(id, addrToString(msg.sender)), "id does not match creator");
        }
        string memory resultDID = generateDIDString();
        require(!dids[resultDID].exist, "did already exists");
        dids[resultDID] = DID(true, hash, uri);

        emit CreateDID(toLower(addrToString(msg.sender)), resultDID);
    }

    function updateHash(string did, bytes32 hash) public onlyDIDOwner(did) {
        dids[generateDIDString()].hash = hash;
        emit UpdateHash(generateDIDString(), hash);
    }

    function updateURI(string did, string uri) public onlyDIDOwner(did) {
        dids[generateDIDString()].uri = uri;
        emit UpdateURI(generateDIDString(), uri);
    }

    function deleteDID(string did) public onlyDIDOwner(did) {
        dids[generateDIDString()].exist = false;
        emit DeleteDID(generateDIDString());
    }

    function getHash(string did) public view returns (bytes32) {
        string memory didString = toLower(did);
        require(dids[didString].exist, "did does not exist");
        return dids[didString].hash;
    }

    function getURI(string did) public view returns (string) {
        string memory didString = toLower(did);
        require(dids[didString].exist, "did does not exist");
        return dids[didString].uri;
    }
}
