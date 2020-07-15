pragma solidity >=0.4.22 <0.6.0;

import './Agentable.sol';
import './DIDManagerBase.sol';

contract UCamDIDManager is Agentable, DIDManagerBase {

    constructor(address _dbAddr) DIDBase(_dbAddr, "did:io:ucam:") public {}

    function formDID(bytes20 uid) internal view returns (bytes memory) {
        // TODO: convert uid to string
        return abi.encodePacked(db.getPrefix(), bytes20ToString(uid));
    }

    function decodeInternalKey(bytes memory did) public view returns (bytes20) {
        require(hasPrefix(did, db.getPrefix()), "invalid DID");
        bytes memory domainID = (slice(did, db.getPrefix().length));
        require(domainID.length == 40, "invalid DID");
        uint160 uid = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 0; i < 40; i += 2){
            uid *= 256;
            b1 = uint8(domainID[i]);
            b2 = uint8(domainID[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            else if ((b1 >= 65)&&(b1 <= 70)) b1 -= 55;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            else if ((b2 >= 65)&&(b2 <= 70)) b2 -= 55;
            uid += (b1*16+b2);
        }
        return bytes20(uid);
    }
    event didmsg(bytes msg);
    event reg(address authorizer);
    event hash(bytes32 msg);
    event authMsg(bytes msg);
    function createDIDByAgent(bytes20 uid, bytes32 h, bytes memory uri, address authorizer, bytes memory auth) public {
        bytes memory did = formDID(uid);
        emit hash(h);
        emit didmsg(did);
        emit reg(getSigner(getCreateAuthMessage(did, h, uri, msg.sender), auth));
        emit authMsg(getCreateAuthMessage(did, h, uri, msg.sender));
        require(authorizer == getSigner(getCreateAuthMessage(did, h, uri, msg.sender), auth), "invalid signature");
        internalCreateDID(did, uid, authorizer, h, uri);
    }

    function updateDIDByAgent(bytes20 uid, bytes32 h, bytes memory uri, bytes memory auth) public {
        bytes memory did = formDID(uid);
        (address authorizer, ,) = db.get(uid);
        require(msg.sender == getSigner(getUpdateAuthMessage(did, h, uri, msg.sender), auth), "invalid signature");
        internalUpdateDID(did, uid, authorizer, h, uri);
    }

    function deleteDIDByAgent(bytes20 uid, bytes memory auth) public {
        bytes memory did = formDID(uid);
        (address authorizer, ,) = db.get(uid);
        require(msg.sender == getSigner(getDeleteAuthMessage(did, msg.sender), auth), "invalid signature");
        internalDeleteDID(did, uid, authorizer);
    }

    function bytes20ToString(bytes20 _addr) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(_addr));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
