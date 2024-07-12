const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../../utils/rootDir");

router.use("/", (req, res, next) => {
  console.log(req.session);
  res.sendFile(path.join(rootDir, "views", "mainPages", "homePage.html"));
});

module.exports = router;
