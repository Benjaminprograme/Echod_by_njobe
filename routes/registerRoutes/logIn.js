const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../../utils/rootDir");
const userController = require("../../controllers/user");

router.get("/log-in", (req, res, next) => {
  res.cookie("authenticatedId", "");
  res.cookie("userId", "");
  res.sendFile(path.join(rootDir, "views", "registerPages", "logIn.html"));
});

router.post("/log-in", (req, res, next) => {
  userController.findeExsistingUser(req, res, {
    email: req.body.email,
    password: req.body.password,
  });
});

module.exports = router;
