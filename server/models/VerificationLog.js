import mongoose from "mongoose";

const verificationLogSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      default: null
    },
    uploadedHash: {
      type: String,
      default: null
    },
    result: {
      type: String,
      enum: ["valid", "fake", "revoked", "not_found"],
      required: true
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  { timestamps: false }
);

const VerificationLog = mongoose.model("VerificationLog", verificationLogSchema);
export default VerificationLog;
