import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

const buildAuthResponse = (user) => ({
  token: signToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    leetcodeProfileUrl: user.leetcodeProfileUrl,
    leetcodeUsername: user.leetcodeUsername,
    preferredMode: user.preferredMode,
    lastSyncedAt: user.lastSyncedAt
  }
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with that email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user || !(await user.comparePassword(password || ""))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json(buildAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});
