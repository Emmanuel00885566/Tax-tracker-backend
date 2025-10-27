import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => error.msg,
});

const validationMiddleware = (req, res, next) => {
    const result = myValidationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            data: result.array(),
        });
    }

    next();
};

const auth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split("")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, wrong token provided!" });
        }
    }

    if(!token) {
        res.status(401).json({ message: "Not authorized, not token provided!" });
    }
};

export { validationMiddleware, auth };