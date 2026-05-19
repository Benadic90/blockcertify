import crypto from "crypto";
import fs from "fs";

export const hashBuffer = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

export const hashFileFromDisk = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return hashBuffer(fileBuffer);
};
