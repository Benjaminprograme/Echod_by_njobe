const userModel = require("../models/user");

exports.signUpUser = (req, res, userData) => {
  userModel.signUp(req, res, userData);
};

exports.verifyAuthericationCode = (req, res, authenticationCode) => {
  userModel.verifyAuthenticationCode(req, res, authenticationCode);
};

exports.findeExsistingUser = (req, res, userData) => {
  userModel.logIn(req, res, userData.email, userData.password);
};
