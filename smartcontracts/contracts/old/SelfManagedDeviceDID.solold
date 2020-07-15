pragma solidity >=0.4.22 <0.6.0;

interface SelfManagedDeviceDID {
    function createDID(string uuid, bytes proof, bytes32 hash, string uri) public;
    function deleteDID(string uuid, bytes proof) public;
    function updateHash(string uuid, bytes proof, bytes32 hash) public;
    function updateURI(string uuid, bytes proof, string uri) public;
    function getHash(string did) public view returns (bytes32);
    function getURI(string did) public view returns (string);
}