import {
  createUser,
  userLogin,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js";

/**
 * @desc Register new user
 */
export async function registerUser(req, res) {
  try {
    const { name, email, password, type, profilePicture } = req.body;
    const userData = await createUser({
      name,
      email,
      password,
      type: type || "individual",
      profilePicture,
    });

    res.status(201).json({
      success: true,
      message: "User registration successful.",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "User registration failed.",
    });
  }
}

/**
 * @desc Login user
 */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await userLogin({ email, password });

    res.status(200).json({
      success: true,
      message: "User login successful.",
      data: userData,
    });
  } catch (error) {
    const statusCode = error.message.includes("Invalid") ? 401 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
}

/**
 * @desc Request password reset
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const token = await requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: "Password reset token generated successfully.",
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
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function changePassword(req, res) {
  return res
    .status(501)
    .json({ success: false, message: "Change password not implemented yet." });
}
