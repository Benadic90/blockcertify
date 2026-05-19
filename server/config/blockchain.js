import { ethers } from "ethers";

const CONTRACT_ABI = [
  "function issueCertificate(string certificateId, string certificateHash)",
  "function verifyCertificate(string certificateId, string certificateHash) view returns (bool)",
  "function revokeCertificate(string certificateId)",
  "function getCertificate(string certificateId) view returns (tuple(string certificateId, string certificateHash, address issuer, uint256 issuedAt, bool exists, bool revoked))"
];

let provider;
let wallet;
let contract;

const toCertificateObject = (data) => {
  if (!data) return null;

  if (typeof data === "object" && data.certificateId !== undefined) {
    return {
      certificateId: data.certificateId,
      certificateHash: data.certificateHash,
      issuer: data.issuer,
      issuedAt: Number(data.issuedAt),
      exists: data.exists,
      revoked: data.revoked
    };
  }

  return {
    certificateId: data[0],
    certificateHash: data[1],
    issuer: data[2],
    issuedAt: Number(data[3]),
    exists: data[4],
    revoked: data[5]
  };
};

export const initBlockchain = () => {
  const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.warn("Blockchain skipped: RPC_URL / PRIVATE_KEY / CONTRACT_ADDRESS missing.");
    return;
  }

  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    console.log("Blockchain integration initialized.");
  } catch (error) {
    console.error("Blockchain init failed:", error.message);
    provider = undefined;
    wallet = undefined;
    contract = undefined;
  }
};

export const isBlockchainReady = () => Boolean(provider && wallet && contract);

const ensureBlockchain = () => {
  if (!isBlockchainReady()) {
    throw new Error("Blockchain config not ready.");
  }
};

export const issueCertificateOnChain = async (certificateId, certificateHash) => {
  ensureBlockchain();
  const tx = await contract.issueCertificate(certificateId, certificateHash);
  const receipt = await tx.wait();
  return { txHash: tx.hash, receipt };
};

export const verifyCertificateOnChain = async (certificateId, certificateHash) => {
  ensureBlockchain();
  return contract.verifyCertificate(certificateId, certificateHash);
};

export const revokeCertificateOnChain = async (certificateId) => {
  ensureBlockchain();
  const tx = await contract.revokeCertificate(certificateId);
  const receipt = await tx.wait();
  return { txHash: tx.hash, receipt };
};

export const getCertificateFromChain = async (certificateId) => {
  ensureBlockchain();
  const certificate = await contract.getCertificate(certificateId);
  return toCertificateObject(certificate);
};
