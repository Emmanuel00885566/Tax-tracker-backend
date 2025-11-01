import { User, BusinessProfile } from "../models/index.js";
import { generateToken } from "../utils/generate.token.js";

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

// services/user.services.js

const getUserProfile = async (user) => {
  const foundUser = await User.findByPk(user.id, {
    attributes: [
      "username",
      "role",
      "annualIncomeRange",
      "tin",
      "tax_reminder",
      "email",
    ]
  });

  if (!foundUser) {
    throw new Error("User not found");
  }

  // Format of what is sent to the client
  const formattedUser = {
    full_name: foundUser.username,
    account_type: foundUser.role,
    incomeBracket: foundUser.annualIncomeRange,
    tax_identification_number: foundUser.tin,
    taxRemindersEnabled: foundUser.tax_reminder,
  };

  return formattedUser;
};

const getBusinessProfile = async (user) => {
    const foundBusiness = await User.findByPk(user.id, {
    attributes: [
      "role",
      "annualIncomeRange",
      "tin",
      "tax_reminder",
    ], 
    include: [
        {
            model: BusinessProfile,
            attributes: [ "businessName", "businessType"],
        },
    ],
  });

  if (!foundBusiness) {
    throw new Error("User not found");
  }

  // Format what you want to send to the client
  const formattedUser = {
    account_type: foundBusiness.role,
    business_name: foundBusiness.BusinessProfile?.businessName || "N/A",
    incomeBracket: foundBusiness.annualIncomeRange,
    tax_identification_number: foundBusiness.tin,
    taxRemindersEnabled: foundBusiness.tax_reminder,
  };

  return formattedUser;
};
  
const updateUserProf = async (userId, updates) => {
  const allowedFields = [
    "username",
    "annualIncomeRange",
    "tin",
    "tax_reminder",
  ];

  // Pick only valid fields to prevent overwriting sensitive data
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  const [updatedCount] = await User.update(filteredUpdates, {
    where: { id: userId },
    individualHooks: true,
  });

  if (!updatedCount) {
    throw new Error("User not found or no changes made");
  }

  // Fetch updated record
  const updatedUser = await User.findByPk(userId, {
    attributes: [
      "username",
      "role",
      "annualIncomeRange",
      "tin",
      "tax_reminder",
      "email",
    ],
  });

  return {
    full_name: updatedUser.username,
    account_type: updatedUser.role,
    incomeBracket: updatedUser.annualIncomeRange,
    tax_identification_number: updatedUser.tin,
    taxRemindersEnabled: updatedUser.tax_reminder,
  };
};

const updateBusinessProf = async (userId, updates) => {
  const allowedUserFields = ["annualIncomeRange", "tin", "tax_reminder"];
  const allowedBusinessFields = ["businessName", "businessType"];

  const userUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedUserFields.includes(key))
  );

  const businessUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedBusinessFields.includes(key))
  );

  // Update user details
  await User.update(userUpdates, {
    where: { id: userId },
    individualHooks: true,
  });

  // Update business profile details
  await BusinessProfile.update(businessUpdates, {
    where: { userId },
  });

  // Fetch updated user + business
  const updatedBusiness = await User.findByPk(userId, {
    attributes: ["role", "annualIncomeRange", "tin", "tax_reminder"],
    include: [
      {
        model: BusinessProfile,
        attributes: ["businessName", "businessType"],
      },
    ],
  });

  if (!updatedBusiness) {
    throw new Error("Business profile not found or no changes made");
  }

  return {
    account_type: updatedBusiness.role,
    business_name: updatedBusiness.BusinessProfile?.businessName || "N/A",
    incomeBracket: updatedBusiness.annualIncomeRange,
    tax_identification_number: updatedBusiness.tin,
    taxRemindersEnabled: updatedBusiness.tax_reminder,
  };
};

const updateRemPreference = async (userId, tax_reminder) => {
  const [updated] = await User.update(
    { tax_reminder },
    { where: { id: userId } }
  );

  return updated; // Sequelize returns [numberOfRowsUpdated]: 0 or 1
};

const changePass = async (userId, password) => {
  await User.update(
    { password },
    { 
      where: { id: userId },
      individualHooks: true // ensures password gets hashed
    }
  );

  // Fetch updated user record
  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ["password"] } // hide password from response
  });

  return updatedUser;
};

const deleteUserProfile = async (userId) => {
  return await User.destroy({
    where: { id: userId },
  });
};


export { createUser, userLogin, getUserProfile, getBusinessProfile, updateUserProf, updateBusinessProf, updateRemPreference, changePass, deleteUserProfile };

// Delete user, update user info, get all users (admin)
// Signup should also generate token (optional)