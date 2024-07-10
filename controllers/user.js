const userModel = require("../models/user");
exports.signUpUser = (req, res, userData) => {
  userModel.signUpUser(req, res, userData);
};

exports.verifyAuthericationCode = (req, res, authenticationCode) => {
  userModel.verifyAuthenticationCode(req, res, authenticationCode);
};
