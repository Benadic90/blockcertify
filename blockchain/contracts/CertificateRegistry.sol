// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    struct Certificate {
        string certificateId;
        string certificateHash;
        address issuer;
        uint256 issuedAt;
        bool exists;
        bool revoked;
    }

    mapping(string => Certificate) private certificates;
    address public owner;

    event CertificateIssued(string indexed certificateId, string certificateHash, address indexed issuer);
    event CertificateRevoked(string indexed certificateId, address indexed revokedBy);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(string memory certificateId, string memory certificateHash) external onlyOwner {
        require(bytes(certificateId).length > 0, "certificateId required");
        require(bytes(certificateHash).length > 0, "certificateHash required");
        require(!certificates[certificateId].exists, "Certificate already exists");

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            certificateHash: certificateHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            exists: true,
            revoked: false
        });

        emit CertificateIssued(certificateId, certificateHash, msg.sender);
    }

    function verifyCertificate(
        string memory certificateId,
        string memory certificateHash
    ) external view returns (bool) {
        Certificate memory cert = certificates[certificateId];
        if (!cert.exists || cert.revoked) {
            return false;
        }
        return keccak256(bytes(cert.certificateHash)) == keccak256(bytes(certificateHash));
    }

    function revokeCertificate(string memory certificateId) external onlyOwner {
        Certificate storage cert = certificates[certificateId];
        require(cert.exists, "Certificate does not exist");
        require(!cert.revoked, "Certificate already revoked");

        cert.revoked = true;
        emit CertificateRevoked(certificateId, msg.sender);
    }

    function getCertificate(string memory certificateId) external view returns (Certificate memory) {
        return certificates[certificateId];
    }
}
