export const individualAccountType = (req, res, next) => {
  req.body.account_type = "individual";
  next();
};

export const businessAccountType = (req, res, next) => {
  req.body.account_type = "business";
  next();
}

// Will be moved to auth