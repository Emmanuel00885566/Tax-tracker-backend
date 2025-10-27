import { createUser, userLogin } from "../services/authService.js";

async function registerUser(req, res) {
    try {
        const { username, email, password, role = "individual" } = req.body;
        await createUser({ username, email, password, role });
        res.status(201).json({ success: true, message: "User registration success"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        await userLogin({ email, password });
        res.status(200).json({
            success: true,
            message: "User login successful"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { registerUser, loginUser };


/*
changePassword
getEmailOTP
verifyEmailOTP
*/