const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../../utils/rootDir");
const userController = require("../../controllers/user");

router.get("/log-in", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "registerPages", "logIn.html"));
});

module.exports = router;
