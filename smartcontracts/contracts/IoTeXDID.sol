pragma solidity >=0.4.14 <0.6.0;
import "./IoTeXDIDStorage.sol";

contract IoTeXDID is IoTeXDIDStorage{
    modifier onlyDIDOwner(string memory didInput, address signer) {
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

    function createDID(string memory id, address signer, bytes32 hash, string memory uri) internal {
        if (bytes(id).length > 0) {
            require(compareStrings(id, addrToString(signer)), "id does not match signer");
        }
        string memory resultDID = generateDIDString(signer);
        require(!dids[resultDID].exist, "did already exists");
        dids[resultDID] = DID(true, hash, uri);

        emit CreateDID(toLower(addrToString(signer)), resultDID);
    }

    function createDID(string memory id, bytes32 hash, string memory uri) public {
        createDID(id, msg.sender, hash, uri);
    }

    function createDIDSigned(string memory id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 hash, string memory uri) public {
        bytes32 sigHash = keccak256(strConcat(id,"createDID",string(hash),uri));
        createDID(id, ecrecover(sigHash, sigV, sigR, sigS), hash, uri);
    }

    function updateHash(string memory did, address signer, bytes32 hash) internal onlyDIDOwner(did, signer) {
        dids[generateDIDString(signer)].hash = hash;
        emit UpdateHash(generateDIDString(signer), hash);
    }

    function updateHash(string memory did, bytes32 hash) public {
        updateHash(did, msg.sender, hash);
    }

    function updateHashSigned(string memory did, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 hash) public {
        bytes32 sigHash = keccak256(abi.encodePacked(did, "updateHash", hash));
        updateHash(did, ecrecover(sigHash, sigV, sigR, sigS), hash);
    }

    function updateURI(string memory did, address signer, string memory uri) internal onlyDIDOwner(did, signer) {
        dids[generateDIDString(signer)].uri = uri;
        emit UpdateURI(generateDIDString(signer), uri);
    }

    function updateURI(string memory did, string memory uri) public {
        updateURI(did, msg.sender, uri);
    }

    function updateURISigned(string memory did, uint8 sigV, bytes32 sigR, bytes32 sigS, string memory uri) public {
        bytes32 sigHash = keccak256(abi.encodePacked(did, "updateURI", uri));
        updateURI(did, ecrecover(sigHash, sigV, sigR, sigS), uri);
    }

    function deleteDID(string memory did, address signer) public onlyDIDOwner(did, signer) {
        dids[generateDIDString(signer)].exist = false;
        emit DeleteDID(generateDIDString(signer));
    }

    function deleteDID(string memory did) public {
        deleteDID(did, msg.sender);
    }

    function deleteDIDSigned(string memory did, uint8 sigV, bytes32 sigR, bytes32 sigS) public {
        bytes32 sigHash = keccak256(abi.encodePacked(did, "deleteDID"));
        deleteDID(did, ecrecover(sigHash, sigV, sigR, sigS));
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

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) internal returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        string memory abcd = new string(_ba.length + _bb.length + _bc.length + _bd.length);
        bytes memory badcd = bytes(abcd);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcd[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) babcd[k++] = _bb[i];
        for (uint i = 0; i < _bc.length; i++) babcd[k++] = _bc[i];
        for (uint i = 0; i < _bd.length; i++) babcd[k++] = _bd[i];
        return string(badcd);
    }
}
