import jwt from "jsonwebtoken";

/**
 * Generate a JSON Web Token (JWT) for user authentication.
 * 
 * @param {Object} payload - Data to encode in the token (e.g., { id, role }).
 * @param {String} [expiresIn="3d"] - Token expiration time.
 * @returns {String} - Signed JWT token.
 */
const generateToken = (payload, expiresIn = "3d") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
