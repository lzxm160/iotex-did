pragma solidity >=0.4.22 <0.6.0;

import './Agentable.sol';
import './DIDManagerBase.sol';

contract UCamDIDManager is Agentable, DIDManagerBase {

    constructor(address _dbAddr) DIDBase(_dbAddr, "did:io:ucam:") public {}

    function formDID(bytes20 uid) internal view returns (bytes memory) {
        // TODO: convert uid to string
        return abi.encodePacked(db.getPrefix(), uid);
    }

    function decodeInternalKey(bytes memory did) public view returns (bytes20) {
        require(hasPrefix(did, db.getPrefix()), "invalid DID");
        bytes memory domainID = (slice(did, db.getPrefix().length));
        require(domainID.length == 20, "invalid DID");
        uint160 uid = 0;
        for (uint i = 0; i < 20; i++){
            uid *= 256;
            uid += uint8(domainID[i]);
        }
        return bytes20(uid);
    }

    function createDIDByAgent(bytes20 uid, bytes32 h, bytes memory uri, address authorizer, bytes memory auth) public {
        bytes memory did = formDID(uid);
        require(authorizer == getSigner(getCreateAuthMessage(did, h, uri, msg.sender), auth), "invalid signature");
        internalCreateDID(did, uid, authorizer, h, uri);
    }

    function updateDIDByAgent(bytes20 uid, bytes32 h, bytes memory uri, bytes memory auth) public {
        bytes memory did = formDID(uid);
        (address authorizer, ,) = db.get(uid);
        require(authorizer == getSigner(getUpdateAuthMessage(did, h, uri, msg.sender), auth), "invalid signature");
        internalUpdateDID(did, uid, authorizer, h, uri);
    }

    function deleteDIDByAgent(bytes20 uid, bytes memory auth) public {
        bytes memory did = formDID(uid);
        (address authorizer, ,) = db.get(uid);
        require(authorizer == getSigner(getDeleteAuthMessage(did, msg.sender), auth), "invalid signature");
        internalDeleteDID(did, uid, authorizer);
    }
}
