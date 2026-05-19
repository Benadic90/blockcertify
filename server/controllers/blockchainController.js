import {
  getCertificateFromChain,
  issueCertificateOnChain,
  isBlockchainReady,
  revokeCertificateOnChain,
  verifyCertificateOnChain
} from "../config/blockchain.js";

const ensureReady = (res) => {
  if (!isBlockchainReady()) {
    res.status(503);
    throw new Error("Blockchain not configured.");
  }
};

export const issueOnBlockchain = async (req, res) => {
  ensureReady(res);
  const { certificateId, certificateHash } = req.body;

  if (!certificateId || !certificateHash) {
    res.status(400);
    throw new Error("certificateId and certificateHash are required.");
  }

  const tx = await issueCertificateOnChain(certificateId, certificateHash);
  res.json({ message: "Certificate issued on blockchain.", txHash: tx.txHash });
};

export const verifyOnBlockchain = async (req, res) => {
  ensureReady(res);
  const { certificateId, hash } = req.params;
  const isValid = await verifyCertificateOnChain(certificateId, hash);
  const record = await getCertificateFromChain(certificateId);
  res.json({ isValid, record });
};

export const revokeOnBlockchain = async (req, res) => {
  ensureReady(res);
  const { certificateId } = req.params;
  const tx = await revokeCertificateOnChain(certificateId);
  res.json({ message: "Certificate revoked on blockchain.", txHash: tx.txHash });
};
