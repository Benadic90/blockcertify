import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = "admin@blockcertify.com";
  const password = "admin123";

  const found = await User.findOne({ email });
  if (found) {
    console.log("Default admin already exists.");
    process.exit(0);
  }

  await User.create({
    name: "BlockCertify Admin",
    email,
    password,
    role: "admin"
  });

  console.log("Default admin created.");
  console.log(`email: ${email}`);
  console.log(`password: ${password}`);
  process.exit(0);
};

run().catch((error) => {
  console.error("createDefaultAdmin failed:", error.message);
  process.exit(1);
});
