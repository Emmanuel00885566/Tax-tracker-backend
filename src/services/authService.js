import User from "../models/User.js";
import generateToken from "../utils/generateToken";

async function createUser(userData) {
    const checkEmailExists = await User.findOne({
        where: { email: userData.email }
    });
    if (checkEmailExists) throw new Error("Email already exists");

    const checkUserNameExists = await User.findOne({
        where: { username: userData.username }
    });
    if (checkUserNameExists) throw new Error("User already exists");

    const newUser = await User.create(userData);

    return {
        newUser,
        token: generateToken(newUser.id)
    };
}

async function userLogin(userData) {
    const checkEmailCorrect = await User.findOne({
        where: { email: userData.email } 
    });
    if (checkEmailCorrect) throw new Error ("Login failed, confirm email and password are correct!");

    const checkPasswordCorrect = await User.matchPassword(password);
    if (!checkPasswordCorrect) throw new Error("Login failed, confirm email and password are correct!");

    return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        token: generateToken(userData.id)
    }
}
export { createUser, userLogin };