import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import VerificationLog from "../models/VerificationLog.js";
import {
  issueCertificateOnChain,
  revokeCertificateOnChain,
  isBlockchainReady
} from "../config/blockchain.js";
import generateCertificateId from "../utils/generateCertificateId.js";
import { hashFileFromDisk } from "../utils/hashFile.js";

export const addStudent = async (req, res) => {
  const { name, email, studentId, password = "student123" } = req.body;

  if (!name || !email || !studentId) {
    res.status(400);
    throw new Error("name, email, studentId are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const duplicate = await User.findOne({
    $or: [{ email: normalizedEmail }, { studentId }]
  });

  if (duplicate) {
    res.status(409);
    throw new Error("Student already exists with this email or studentId.");
  }

  const student = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: "student",
    studentId
  });

  res.status(201).json({
    message: "Student added successfully.",
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      createdAt: student.createdAt
    },
    defaultPassword: password
  });
};

export const getStudents = async (_req, res) => {
  const students = await User.find({ role: "student" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ students });
};

export const issueCertificate = async (req, res) => {
  const {
    certificateId: incomingCertificateId,
    studentName,
    studentEmail,
    studentId,
    courseName,
    eventName = "",
    issueDate,
    issuerName
  } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Certificate PDF file is required.");
  }

  if (
    !studentName ||
    !studentEmail ||
    !studentId ||
    !courseName ||
    !issueDate ||
    !issuerName
  ) {
    res.status(400);
    throw new Error("Missing required fields for issuing certificate.");
  }

  const certificateHash = hashFileFromDisk(req.file.path);
  const certificateId = incomingCertificateId || generateCertificateId();

  const existingCertificate = await Certificate.findOne({ certificateId });
  if (existingCertificate) {
    res.status(409);
    throw new Error("Certificate ID already exists.");
  }

  let blockchainStatus = "pending";
  let blockchainTxHash = null;

  if (isBlockchainReady()) {
    try {
      const chainResult = await issueCertificateOnChain(certificateId, certificateHash);
      blockchainStatus = "confirmed";
      blockchainTxHash = chainResult.txHash;
    } catch (error) {
      blockchainStatus = "failed";
      console.error("Blockchain issue failed:", error.message);
    }
  }

  const pdfPath = `uploads/certificates/${req.file.filename}`;

  const certificate = await Certificate.create({
    certificateId,
    studentName,
    studentEmail: studentEmail.toLowerCase().trim(),
    studentId,
    courseName,
    eventName,
    issueDate,
    issuerName,
    certificateHash,
    blockchainTxHash,
    blockchainStatus,
    isRevoked: false,
    pdfPath,
    issuedBy: req.user._id
  });

  res.status(201).json({
    message: "Certificate issued successfully.",
    certificate
  });
};

export const getIssuedCertificates = async (_req, res) => {
  const certificates = await Certificate.find()
    .populate("issuedBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ certificates });
};

export const revokeCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found.");
  }

  if (certificate.isRevoked) {
    res.status(400);
    throw new Error("Certificate already revoked.");
  }

  let txHash = null;
  if (isBlockchainReady()) {
    try {
      const chainResult = await revokeCertificateOnChain(certificate.certificateId);
      txHash = chainResult.txHash;
      certificate.blockchainStatus = "confirmed";
    } catch (error) {
      certificate.blockchainStatus = "failed";
      console.error("Blockchain revoke failed:", error.message);
    }
  }

  certificate.isRevoked = true;
  if (txHash) {
    certificate.blockchainTxHash = txHash;
  }

  await certificate.save();

  res.json({
    message: "Certificate revoked successfully.",
    certificate
  });
};

export const getDashboardSummary = async (_req, res) => {
  const [totalCertificates, totalStudents, totalVerifications, revokedCertificates] =
    await Promise.all([
      Certificate.countDocuments(),
      User.countDocuments({ role: "student" }),
      VerificationLog.countDocuments(),
      Certificate.countDocuments({ isRevoked: true })
    ]);

  res.json({
    totalCertificates,
    totalStudents,
    totalVerifications,
    revokedCertificates
  });
};
