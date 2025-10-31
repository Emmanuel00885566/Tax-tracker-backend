import User from "../models/index.js";
import { generateToken } from "../utils/generateToken.js";

async function createUser(userData) {
    console.log('Creating user with data:', userData);

    const checkEmailExists = await User.findOne({
        where: { email: userData.email }
    });
    if (checkEmailExists) throw new Error("Email already exists");

    const checkUserNameExists = await User.findOne({
        where: { username: userData.username }
    });
    if (checkUserNameExists) throw new Error("User already exists");

    const newUser = await User.create(userData);
    console.log('Creating user with data:', userData);

    // const token = generateToken(newUser.id);
    // console.log("Generated token for user:", newUser.id);

    return {
        ...newUser.toJSON(),
        // token: token,
    };
}

async function userLogin(userData) {
    console.log('Login attempt for email:', userData.email);

    const user = await User.findOne({
        where: { email: userData.email } 
    });
    if (!user) throw new Error ("Login failed, confirm email is correct!");

    console.log('User found:', user.toJSON());

    const isPasswordValid = await user.verifyPassword(userData.password);
    if (!isPasswordValid) {
        throw new Error("Login failed, confirm password is correct!");
    }

    const token = generateToken(user);
    console.log(`Generated token for user ${user.id}: ${token}`);

// Login failed, confirm email and password are correct!

    return {
        ...user.toJSON(),
        token: token,
    }
};

export { createUser, userLogin };

// Delete user, update user info, get all users (admin)
// Signup should also generate token (optional)