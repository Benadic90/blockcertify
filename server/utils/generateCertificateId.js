import crypto from "crypto";

const generateCertificateId = () => {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BC-${stamp}-${random}`;
};

export default generateCertificateId;
