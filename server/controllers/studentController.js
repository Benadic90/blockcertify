import Certificate from "../models/Certificate.js";

export const getStudentCertificates = async (req, res) => {
  const filters = [{ studentEmail: req.user.email }];

  if (req.user.studentId) {
    filters.push({ studentId: req.user.studentId });
  }

  const certificates = await Certificate.find({ $or: filters }).sort({
    createdAt: -1
  });

  res.json({ certificates });
};
