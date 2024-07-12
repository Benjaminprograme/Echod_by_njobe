const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../../utils/rootDir");
const userController = require("../../controllers/user");

router.use("/sign-up/authentication", (req, res, next) => {
  if (req.query.authenticationCode === undefined) {
    res.sendFile(
      path.join(rootDir, "views", "registerPages", "autherication.html")
    );
  } else {
    userController.verifyAuthericationCode(
      req,
      res,
      req.query.authenticationCode
    );
  }
});

router.post("/sign-up", (req, res, next) => {
  userController.signUpUser(req, res, {
    email: req.body.email,
    password: req.body.password,
    repetedPassword: req.body.repetedPassword,
  });
});

router.get("/sign-up", (req, res, next) => {
  req.session.destroy();
  res.sendFile(path.join(rootDir, "views", "registerPages", "signUp.html"));
});

module.exports = router;
