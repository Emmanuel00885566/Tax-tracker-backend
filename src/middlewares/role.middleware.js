export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.account_type) {
      return res.status(401).json({ message: "Unauthorized: user account type missing" });
    }

    if (!allowedRoles.includes(user.account_type)) {
      return res.status(403).json({
        message: "Access denied: this action is not allowed for your account type",
      });
    }

    next();
  };
};
