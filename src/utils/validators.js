import Joi from "joi";

// Registration validation
export const registerValidator = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("individual", "company").required()
  });
  return schema.validate(data);
};

// Login validation
export const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// OTP validation
export const otpValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  });
  return schema.validate(data);
};

// Password update validation
export const passwordChangeValidator = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  });
  return schema.validate(data);
};
