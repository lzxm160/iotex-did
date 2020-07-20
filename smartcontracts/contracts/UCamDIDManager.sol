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
//                uint160 m = 0;
//                uint160 b = 0;
//
//                for (uint8 i = 0; i < 20; i++) {
//                    m *= 256;
//                    b = uint160(domainID[i]);
//                    m += (b);
//                }
//        bytes20 ret;
//        for (uint8 i = 0; i < 20; i++) {
//            ret[i] = domainID[i];
//        }
//                return ret;
//        assembly {
////            let _ptr :=add(msize(),1)
////            mstore(_ptr,domainID)
////            return (_ptr,0x14)
//            let _ptr :=mload(0x40) //0x80
//            mstore(_ptr,domainID)
//            return (add(_ptr,0xc),0x14)
//        }
    }
    event didmsg(bytes msg);
    event reg(address authorizer);
    event hash(bytes32 msg);
    event authMsg(bytes msg);
    event authaddress(address authorizer);
    event inputsig(bytes msg);
    function createDIDByAgent(bytes20 uid, bytes32 h, bytes memory uri, address authorizer, bytes memory auth) public {
        bytes memory did = formDID(uid);
        emit hash(h);
        emit didmsg(did);
        emit reg(getSigner(getCreateAuthMessage(did, h, uri, msg.sender), auth));
        emit authMsg(getCreateAuthMessage(did, h, uri, msg.sender));
        emit authaddress(authorizer);
        emit inputsig(auth);
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
        emit didmsg(uid);
        emit inputsig(auth);

        bytes memory did = formDID(uid);

        emit didmsg(did);
        emit reg(getSigner(getDeleteAuthMessage(did, msg.sender), auth));
        emit authMsg(getDeleteAuthMessage(did, msg.sender));
        (address authorizer, ,) = db.get(uid);
        emit authaddress(authorizer);

        require(authorizer == getSigner(getDeleteAuthMessage(did, msg.sender), auth), "invalid signature");
        internalDeleteDID(did, uid, authorizer);
    }

    function bytes20ToString(bytes20 _addr) internal pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            str[i*2] = alphabet[uint8(_addr[i] >> 4)];
            str[1+i*2] = alphabet[uint8(_addr[i] & 0x0f)];
        }
        return string(str);
    }
}
