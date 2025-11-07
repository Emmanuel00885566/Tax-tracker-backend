import Joi from "joi";

export const registerValidator = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("individual", "business").required(),

    annualIncomeRange: Joi.string().optional(),
    tax_reminder: Joi.boolean().optional(),

    businessName: Joi.when("role", {
      is: "business",
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    }),
    businessType: Joi.when("role", {
      is: "business",
      then: Joi.string().min(2).required(),
      otherwise: Joi.forbidden()
    })
  });

  return schema.validate(data);
};

export const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

export const otpValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  });
  return schema.validate(data);
};

export const passwordChangeValidator = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  });
  return schema.validate(data);
};
