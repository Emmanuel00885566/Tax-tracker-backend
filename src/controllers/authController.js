import { createUser, userLogin } from "../services/authService.js";

async function registerUser(req, res) {
    try {
        // role = "individual", Try if the default value will hold on its own
        const { username, email, password, role, profilePicture } = req.body;
        const userData =await createUser({ username, email, password, role, profilePicture });

        res.status(201).json({ success: true, 
            message: "User registration successful", 
            data: userData 
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
        const userData = await userLogin({ email, password });

        res.status(200).json({
            success: true,
            message: "User login successful",
            data: userData
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

export { registerUser, loginUser };


/*
changePassword
getEmailOTP
verifyEmailOTP
*/