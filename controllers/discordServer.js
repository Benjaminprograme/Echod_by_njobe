const discordServerModel = require("../models/discordServer");

exports.getNewServerData = (req, res, serverData) => {
  discordServerModel.checkIfServerExsists(
    req,
    res,
    serverData.name,
    serverData.description
  );
};
