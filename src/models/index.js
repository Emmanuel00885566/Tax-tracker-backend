import User from "./user.model.js";
import BusinessProfile from "./business.profile.js";

User.hasOne(BusinessProfile, {
  foreignKey: "userId",
  as: "businessProfile",
});

BusinessProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, BusinessProfile };
