import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

/**
 * @desc Create new user
 */
export async function createUser({ name, email, password, type, profilePicture }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already in use.");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    type,
    profilePicture: profilePicture || null,
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.type },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    type: user.type,
    token,
  };
}

/**
 * @desc Login user
 */
export async function userLogin({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password.");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.type },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    type: user.type,
    token,
  };
}

/**
 * @desc Request password reset token
 */
export async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found.");

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save();

  return resetToken;
}

/**
 * @desc Reset password with valid token
 */
export async function resetPassword(token, newPassword) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error("Invalid or expired token.");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
  } catch {
    throw new Error("Invalid or expired token.");
  }
}
