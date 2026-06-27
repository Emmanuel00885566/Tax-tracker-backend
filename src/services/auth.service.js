import { User } from "../models/index.js";
import BusinessProfile from "../models/business.profile.js";
import generateToken, { generateRefreshToken } from "../utils/generate.token.js";

// ==================== USER REGISTRATION ====================
export async function createUser(userData) {
  const existingEmail = await User.findOne({ where: { email: userData.email } });
  if (existingEmail) throw new Error("Email already exists");

  const newUser = await User.create(userData);
  return newUser;
}

// ==================== USER LOGIN ====================
export async function userLogin({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Login failed. Check your email and try again.");

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) throw new Error("Login failed. Incorrect password.");

  const token = generateToken({ 
    id: user.id, 
    account_type: user.account_type, 
    email: user.email 
  });

  const refreshToken = generateRefreshToken({ 
    id: user.id, 
    email: user.email 
  });

  return {
    ...user.toJSON(),
    token,
    refreshToken,
  };
}

// ==================== USER PROFILE - INDIVIDUAL ====================
export async function getUserProfile(user) {
  const foundUser = await User.findByPk(user.id, {
  attributes: ["email", "account_type", "annualIncomeRange", "tin", "tax_reminder"],
  });
  if (!foundUser) throw new Error("User not found");

  return {
    full_name: foundUser.email.split("@")[0],
    account_type: foundUser.account_type,
    incomeBracket: foundUser.annualIncomeRange,
    tax_identification_number: foundUser.tin,
    taxRemindersEnabled: foundUser.tax_reminder,
  };
}

// ==================== USER PROFILE - BUSINESS ====================
export async function getBusinessProfile(user) {
  const foundBusiness = await User.findByPk(user.id, {
    attributes: ["account_type", "annualIncomeRange", "tin", "tax_reminder"],
    include: [
      {
        model: BusinessProfile,
        as: "businessProfile",
        attributes: ["businessName", "businessType"],
      },
    ],
  });
  if (!foundBusiness) throw new Error("Business user not found");

  return {
    account_type: foundBusiness.account_type,
    business_name: foundBusiness.businessProfile?.businessName || "N/A",
    incomeBracket: foundBusiness.annualIncomeRange,
    tax_identification_number: foundBusiness.tin,
    taxRemindersEnabled: foundBusiness.tax_reminder,
  };
}

// ==================== UPDATE INDIVIDUAL PROFILE ====================
export async function updateUserProf(userId, updates) {
  const allowed = ["annualIncomeRange", "tin", "tax_reminder"];
  const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowed.includes(key)));

  const [updated] = await User.update(filteredUpdates, { where: { id: userId }, individualHooks: true });
  if (!updated) throw new Error("User not found or no changes made");

  const updatedUser = await User.findByPk(userId, {
    attributes: ["email", "account_type", "annualIncomeRange", "tin", "tax_reminder"],
  });

  return {
    full_name: updatedUser.email.split("@")[0],
    account_type: updatedUser.account_type,
    incomeBracket: updatedUser.annualIncomeRange,
    tax_identification_number: updatedUser.tin,
    taxRemindersEnabled: updatedUser.tax_reminder,
  };
}

// ==================== UPDATE BUSINESS PROFILE ====================
export async function updateBusinessProf(userId, updates) {
  const allowedUserFields = ["annualIncomeRange", "tin", "tax_reminder"];
  const allowedBusinessFields = ["businessName", "businessType"];

  const userUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedUserFields.includes(key)));
  const businessUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedBusinessFields.includes(key)));

  await User.update(userUpdates, { where: { id: userId }, individualHooks: true });
  await BusinessProfile.update(businessUpdates, { where: { userId } });

  const updatedBusiness = await User.findByPk(userId, {
    attributes: ["account_type", "annualIncomeRange", "tin", "tax_reminder"],
    include: [{ model: BusinessProfile,
      as: "businessProfile",
      attributes: ["businessName", "businessType"] }],
  });

  if (!updatedBusiness) throw new Error("Business profile not found");

  return {
    account_type: updatedBusiness.account_type,
    business_name: updatedBusiness.businessProfile?.businessName || "N/A",
    incomeBracket: updatedBusiness.annualIncomeRange,
    tax_identification_number: updatedBusiness.tin,
    taxRemindersEnabled: updatedBusiness.tax_reminder,
  };
}

// ==================== UPDATE TAX REMINDER ====================
export async function updateRemPreference(userId, tax_reminder) {
  const [updated] = await User.update({ tax_reminder }, { where: { id: userId } });
  return updated;
}

// ==================== CHANGE PASSWORD ====================
export async function changePass(userId, password) {
  await User.update({ password }, { where: { id: userId }, individualHooks: true });
  const updatedUser = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  return updatedUser;
}

// ==================== DELETE USER ====================
export async function deleteUserProfile(userId) {
  return await User.destroy({ where: { id: userId } });
}
