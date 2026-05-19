import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  createdAt: user.createdAt
});

export const register = async (req, res) => {
  const { name, email, password, role = "student", studentId } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email, password are required.");
  }

  if (!["admin", "student"].includes(role)) {
    res.status(400);
    throw new Error("role must be admin or student.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
    studentId: studentId || null
  });

  res.status(201).json({
    message: "Registration successful.",
    token: generateToken(user._id, user.role),
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  res.json({
    message: "Login successful.",
    token: generateToken(user._id, user.role),
    user: sanitizeUser(user)
  });
};

export const getMe = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
