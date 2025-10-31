import { createUser, userLogin } from "../services/authService.js";
//import { IndividualProfile } from "../models/individualProfile.js";
import BusinessProfile from "../models/businessProfile.js";

async function registerUser(req, res) {
    try {
        // role = "individual", Try if the default value will hold on its own
        const { fullname, email, password, account_type, tax_identification_number, annualIncomeRange, tax_reminder } = req.body;
        const newUser =await createUser({ 
            username:fullname, 
            email, 
            password, 
            role:account_type, 
            tin:tax_identification_number,
            annualIncomeRange, 
            tax_reminder,
        });

        if (account_type === 'business') {
            const { businessName, businessType } = req.body;
            await BusinessProfile.create({
                userId: newUser.id,
                businessName,
                businessType,
            });
        }

        res.status(201).json({ success: true, 
            message: "User registration successful", 
            data: newUser 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userLogin({ email, password });

        res.status(200).json({
            success: true,
            message: "User login successful",
            data: user
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

const resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
      return res.status(400).json({ message: "Both password and confirmPassword are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired. Please request a new one." });
    }
    res.status(500).json({
      success: false,
      message: "Password reset failed.",
      error: error.message,
    });
  }
};

const updateReminderPreference = async (req, res) => {
  try {
    const { receive_tax_reminders } = req.body;

    await User.update(
      { receive_tax_reminders },
      { where: { id: req.user.id } }
    );

    res.status(200).json({
      success: true,
      message: `Tax reminder preference updated to ${receive_tax_reminders ? "ON" : "OFF"}.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating tax reminder preference.",
      error: error.message,
    });
  }
};

export { registerUser, loginUser, resetPasswordWithToken, updateReminderPreference };


/*
changePassword
getEmailOTP
verifyEmailOTP
*/