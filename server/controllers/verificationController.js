import fs from "fs";

import Certificate from "../models/Certificate.js";
import VerificationLog from "../models/VerificationLog.js";
import { getCertificateFromChain, isBlockchainReady } from "../config/blockchain.js";
import { hashFileFromDisk } from "../utils/hashFile.js";

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? String(forwarded).split(",")[0].trim() : req.ip || null;
};

const evaluateCertificate = async ({ certificate, uploadedHash }) => {
  if (!certificate) {
    return { result: "not_found", message: "Certificate not found in records." };
  }

  if (certificate.isRevoked) {
    return { result: "revoked", message: "Certificate was issued but has been revoked." };
  }

  if (uploadedHash && uploadedHash !== certificate.certificateHash) {
    return { result: "fake", message: "Certificate hash mismatch in database." };
  }

  if (isBlockchainReady()) {
    try {
      const chainRecord = await getCertificateFromChain(certificate.certificateId);

      if (!chainRecord.exists) {
        return { result: "fake", message: "Certificate not found on blockchain.", chainRecord };
      }

      if (chainRecord.revoked) {
        return {
          result: "revoked",
          message: "Certificate exists on blockchain but is revoked.",
          chainRecord
        };
      }

      if (chainRecord.certificateHash !== certificate.certificateHash) {
        return {
          result: "fake",
          message: "Blockchain hash does not match database hash.",
          chainRecord
        };
      }

      if (uploadedHash && chainRecord.certificateHash !== uploadedHash) {
        return {
          result: "fake",
          message: "Uploaded file hash does not match blockchain hash.",
          chainRecord
        };
      }

      return {
        result: "valid",
        message: "Certificate is valid and verified on blockchain.",
        chainRecord
      };
    } catch (error) {
      return {
        result: "valid",
        message: "Certificate valid in database. Blockchain check unavailable.",
        blockchainError: error.message
      };
    }
  }

  return {
    result: "valid",
    message: "Certificate valid in database. Blockchain not configured."
  };
};

const buildPayload = (certificate) => {
  if (!certificate) return null;

  return {
    id: certificate._id,
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    studentEmail: certificate.studentEmail,
    studentId: certificate.studentId,
    courseName: certificate.courseName,
    eventName: certificate.eventName,
    issueDate: certificate.issueDate,
    issuerName: certificate.issuerName,
    certificateHash: certificate.certificateHash,
    blockchainTxHash: certificate.blockchainTxHash,
    blockchainStatus: certificate.blockchainStatus,
    isRevoked: certificate.isRevoked,
    pdfPath: certificate.pdfPath
  };
};

export const verifyByUpload = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("PDF file is required.");
  }

  try {
    const uploadedHash = hashFileFromDisk(req.file.path);
    const certificate = await Certificate.findOne({ certificateHash: uploadedHash });

    const evaluation = await evaluateCertificate({ certificate, uploadedHash });

    await VerificationLog.create({
      certificateId: certificate?.certificateId || null,
      uploadedHash,
      result: evaluation.result,
      ipAddress: getClientIp(req)
    });

    res.json({
      result: evaluation.result,
      message: evaluation.message,
      uploadedHash,
      certificate: buildPayload(certificate),
      blockchain: evaluation.chainRecord || null,
      blockchainError: evaluation.blockchainError || null
    });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.warn("Temporary verify file cleanup failed:", error.message);
      }
    }
  }
};

export const verifyByCertificateId = async (req, res) => {
  const { certificateId } = req.params;
  const certificate = await Certificate.findOne({ certificateId });
  const evaluation = await evaluateCertificate({ certificate, uploadedHash: null });

  await VerificationLog.create({
    certificateId,
    uploadedHash: null,
    result: evaluation.result,
    ipAddress: getClientIp(req)
  });

  res.json({
    result: evaluation.result,
    message: evaluation.message,
    certificate: buildPayload(certificate),
    blockchain: evaluation.chainRecord || null,
    blockchainError: evaluation.blockchainError || null
  });
};

export const verifyByHash = async (req, res) => {
  const { certificateId, certificateHash } = req.body;

  if (!certificateId && !certificateHash) {
    res.status(400);
    throw new Error("certificateId or certificateHash is required.");
  }

  let certificate = null;
  if (certificateId) {
    certificate = await Certificate.findOne({ certificateId });
  } else if (certificateHash) {
    certificate = await Certificate.findOne({ certificateHash });
  }

  const evaluation = await evaluateCertificate({
    certificate,
    uploadedHash: certificateHash || null
  });

  await VerificationLog.create({
    certificateId: certificateId || certificate?.certificateId || null,
    uploadedHash: certificateHash || null,
    result: evaluation.result,
    ipAddress: getClientIp(req)
  });

  res.json({
    result: evaluation.result,
    message: evaluation.message,
    certificate: buildPayload(certificate),
    blockchain: evaluation.chainRecord || null,
    blockchainError: evaluation.blockchainError || null
  });
};
