import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); 
  await user.save();

  return resetToken;
}

export async function resetPassword(token, newPassword) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error("Invalid or expired token");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
