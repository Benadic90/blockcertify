import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true
    },
    courseName: {
      type: String,
      required: true,
      trim: true
    },
    eventName: {
      type: String,
      default: "",
      trim: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    issuerName: {
      type: String,
      required: true,
      trim: true
    },
    certificateHash: {
      type: String,
      required: true,
      index: true
    },
    blockchainTxHash: {
      type: String,
      default: null
    },
    blockchainStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending"
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    pdfPath: {
      type: String,
      required: true
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
