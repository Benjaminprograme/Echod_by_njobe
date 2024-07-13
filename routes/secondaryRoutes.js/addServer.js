const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../../utils/rootDir");
const discordServerController = require("../../controllers/discordServer");

router.get("/add-server", (req, res, next) => {
  res.sendFile(
    path.join(rootDir, "views", "secondaryPages", "addServerPage.html")
  );
});

router.post("/add-server", (req, res, next) => {
  discordServerController.getNewServerData(req, res, {
    name: req.body.serverName,
    description: req.body.serverDescription,
  });
});

module.exports = router;
