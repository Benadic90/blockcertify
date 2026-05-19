import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

dotenv.config();

const runSeed = async () => {
  await connectDB();

  const adminEmail = "admin@blockcertify.com";
  const adminPassword = "admin123";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "BlockCertify Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin"
    });
  }

  const sampleStudents = [
    {
      name: "Rahul Sharma",
      email: "rahul@student.com",
      password: "student123",
      role: "student",
      studentId: "STU1001"
    },
    {
      name: "Ananya Patel",
      email: "ananya@student.com",
      password: "student123",
      role: "student",
      studentId: "STU1002"
    }
  ];

  for (const studentData of sampleStudents) {
    const found = await User.findOne({ email: studentData.email });
    if (!found) {
      await User.create(studentData);
    }
  }

  await Certificate.deleteMany({
    certificateId: { $in: ["BC-DEMO-0001", "BC-DEMO-0002"] }
  });

  await Certificate.insertMany([
    {
      certificateId: "BC-DEMO-0001",
      studentName: "Rahul Sharma",
      studentEmail: "rahul@student.com",
      studentId: "STU1001",
      courseName: "B.Tech Computer Science",
      eventName: "Final Year Completion",
      issueDate: new Date("2025-06-15"),
      issuerName: "Dr. Meera Nair",
      certificateHash:
        "8b6c47ca5186f5361d6d404db1961c87da34a1209a6a0b648f70f00479cc0b59",
      blockchainTxHash: null,
      blockchainStatus: "pending",
      isRevoked: false,
      pdfPath: "uploads/certificates/demo-rahul.pdf",
      issuedBy: admin._id
    },
    {
      certificateId: "BC-DEMO-0002",
      studentName: "Ananya Patel",
      studentEmail: "ananya@student.com",
      studentId: "STU1002",
      courseName: "B.Sc Data Science",
      eventName: "AI Workshop Certificate",
      issueDate: new Date("2025-07-10"),
      issuerName: "Prof. Arvind Rao",
      certificateHash:
        "89d1cafb858ea19845d6f29f61941627b01be6cbba600159c18f64801239108a",
      blockchainTxHash: null,
      blockchainStatus: "pending",
      isRevoked: true,
      pdfPath: "uploads/certificates/demo-ananya.pdf",
      issuedBy: admin._id
    }
  ]);

  console.log("Seed completed.");
  console.log("Admin Login:");
  console.log(`email: ${adminEmail}`);
  console.log(`password: ${adminPassword}`);
  console.log("Student password for sample users: student123");
  process.exit(0);
};

runSeed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
