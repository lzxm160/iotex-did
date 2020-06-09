pragma solidity >=0.4.21 <0.6.0;

import "./IoTeXDIDStorage.sol";

contract IoTeXDID is IoTeXDIDStorage{
    modifier onlyDIDOwner(string memory didInput) {
        onlyDIDOwner(didInput,msg.sender);
    }

    modifier onlyDIDOwner(string memory didInput,address signer) {
        string memory didString = generateDIDString(signer);
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

    function createDID(string memory id, address signer,bytes32 hash, string memory uri) internal onlyDIDOwner(id, signer)  {
        if (bytes(id).length > 0) {
            require(compareStrings(id, addrToString(signer)), "id does not match creator");
        }
        string memory resultDID = generateDIDString(signer);
        require(!dids[resultDID].exist, "did already exists");
        dids[resultDID] = DID(true, hash, uri);

        emit CreateDID(toLower(addrToString(signer)), resultDID);
    }

    function createDID(string memory did, bytes32 hash, string memory uri) public {
        createDID(id,msg.sender,hash,uri);
    }

    function createDIDSigned(string memory did, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 hash, string memory uri) public {
        bytes32 sigHash = keccak256(id, "createDID", hash, uri);
        createDID(id, checkSignature(id, sigV, sigR, sigS, sigHash),hash,uri);
    }

    function updateHash(string memory did, bytes32 hash) public onlyDIDOwner(did) {
        dids[generateDIDString()].hash = hash;
        emit UpdateHash(generateDIDString(), hash);
    }

    function updateURI(string memory did, string memory uri) public onlyDIDOwner(did) {
        dids[generateDIDString()].uri = uri;
        emit UpdateURI(generateDIDString(), uri);
    }

    function deleteDID(string memory did) public onlyDIDOwner(did) {
        dids[generateDIDString()].exist = false;
        emit DeleteDID(generateDIDString());
    }

    function getHash(string memory did) public view returns (bytes32) {
        string memory didString = toLower(did);
        require(dids[didString].exist, "did does not exist");
        return dids[didString].hash;
    }

    function getURI(string memory did) public view returns (string memory) {
        string memory didString = toLower(did);
        require(dids[didString].exist, "did does not exist");
        return dids[didString].uri;
    }

    function checkSignature(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 hash) internal returns(address) {
        address signer = ecrecover(hash, sigV, sigR, sigS);
        require(signer == identity);
        return signer;
    }
}
