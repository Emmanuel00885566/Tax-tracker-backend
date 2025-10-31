import { 
  createUser, 
  userLogin, 
  requestPasswordReset, 
  resetPassword 
} from "../services/auth.service.js";

export async function registerUser(req, res) {
  try {
    const { username, email, password, role, profilePicture } = req.body;
    const roleToUse = role || "individual"; 
    const userData = await createUser({ username, email, password, role: roleToUse, profilePicture });

    res.status(201).json({
      success: true,
      message: "User registration successful",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "User registration failed",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await userLogin({ email, password });

    res.status(200).json({
      success: true,
      message: "User login successful",
      data: userData,
    });
  } catch (error) {
    const statusCode = error.message.includes("Invalid") ? 401 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const token = await requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: "Password reset token generated successfully",
      resetToken: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function changePassword(req, res) {
  res.status(501).json({ success: false, message: "Not implemented yet" });
}
