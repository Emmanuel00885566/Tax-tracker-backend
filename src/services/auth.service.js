import { User, BusinessProfile } from "../models/index.js";
import generateToken from "../utils/generate.token.js";

/* ---------------------------------
   Create New User (Registration)
--------------------------------- */
export async function createUser(userData) {
  const existingEmail = await User.findOne({ where: { email: userData.email } });
  if (existingEmail) throw new Error("Email already exists");

  const existingUsername = await User.findOne({ where: { username: userData.username } });
  if (existingUsername) throw new Error("Username already exists");

  const newUser = await User.create(userData);
return newUser; // return the full Sequelize model instance
    // token,
  }

/* ---------------------------------
   Login User
--------------------------------- */
export async function userLogin({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Login failed. Check your email and try again.");

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) throw new Error("Login failed. Incorrect password.");

  const token = generateToken({ id: user.id });

  return {
    ...user.toJSON(),
    token,
  };
}

/* ---------------------------------
   User Profile - Individual
--------------------------------- */
export async function getUserProfile(user) {
  const foundUser = await User.findByPk(user.id, {
    attributes: ["username", "role", "annualIncomeRange", "tin", "tax_reminder", "email"],
  });
  if (!foundUser) throw new Error("User not found");

  return {
    full_name: foundUser.username,
    account_type: foundUser.role,
    incomeBracket: foundUser.annualIncomeRange,
    tax_identification_number: foundUser.tin,
    taxRemindersEnabled: foundUser.tax_reminder,
  };
}

/* ---------------------------------
   User Profile - Business
--------------------------------- */
export async function getBusinessProfile(user) {
  const foundBusiness = await User.findByPk(user.id, {
    attributes: ["role", "annualIncomeRange", "tin", "tax_reminder"],
    include: [
      {
        model: BusinessProfile,
        attributes: ["businessName", "businessType"],
      },
    ],
  });
  if (!foundBusiness) throw new Error("Business user not found");

  return {
    account_type: foundBusiness.role,
    business_name: foundBusiness.BusinessProfile?.businessName || "N/A",
    incomeBracket: foundBusiness.annualIncomeRange,
    tax_identification_number: foundBusiness.tin,
    taxRemindersEnabled: foundBusiness.tax_reminder,
  };
}

/* ---------------------------------
   Update Individual Profile
--------------------------------- */
export async function updateUserProf(userId, updates) {
  const allowed = ["username", "annualIncomeRange", "tin", "tax_reminder"];
  const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowed.includes(key)));

  const [updated] = await User.update(filteredUpdates, { where: { id: userId }, individualHooks: true });
  if (!updated) throw new Error("User not found or no changes made");

  const updatedUser = await User.findByPk(userId, {
    attributes: ["username", "role", "annualIncomeRange", "tin", "tax_reminder", "email"],
  });

  return {
    full_name: updatedUser.username,
    account_type: updatedUser.role,
    incomeBracket: updatedUser.annualIncomeRange,
    tax_identification_number: updatedUser.tin,
    taxRemindersEnabled: updatedUser.tax_reminder,
  };
}

/* ---------------------------------
   Update Business Profile
--------------------------------- */
export async function updateBusinessProf(userId, updates) {
  const allowedUserFields = ["annualIncomeRange", "tin", "tax_reminder"];
  const allowedBusinessFields = ["businessName", "businessType"];

  const userUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedUserFields.includes(key)));
  const businessUpdates = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedBusinessFields.includes(key)));

  await User.update(userUpdates, { where: { id: userId }, individualHooks: true });
  await BusinessProfile.update(businessUpdates, { where: { userId } });

  const updatedBusiness = await User.findByPk(userId, {
    attributes: ["role", "annualIncomeRange", "tin", "tax_reminder"],
    include: [{ model: BusinessProfile, attributes: ["businessName", "businessType"] }],
  });

  if (!updatedBusiness) throw new Error("Business profile not found");

  return {
    account_type: updatedBusiness.role,
    business_name: updatedBusiness.BusinessProfile?.businessName || "N/A",
    incomeBracket: updatedBusiness.annualIncomeRange,
    tax_identification_number: updatedBusiness.tin,
    taxRemindersEnabled: updatedBusiness.tax_reminder,
  };
}

/* ---------------------------------
   Update Tax Reminder Preference
--------------------------------- */
export async function updateRemPreference(userId, tax_reminder) {
  const [updated] = await User.update({ tax_reminder }, { where: { id: userId } });
  return updated;
}

/* ---------------------------------
   Change Password
--------------------------------- */
export async function changePass(userId, password) {
  await User.update({ password }, { where: { id: userId }, individualHooks: true });
  const updatedUser = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  return updatedUser;
}

/* ---------------------------------
   Delete User Profile
--------------------------------- */
export async function deleteUserProfile(userId) {
  return await User.destroy({ where: { id: userId } });
}
