const db = require("../utils/dataBase");

module.exports = {
  checkIfServerExsists: (req, res, serverName, serverDescription) => {
    db.execute("SELECT * FROM `discord_servers` WHERE `server_name` = ?", [
      serverName,
    ]).then((resault) => {
      if (resault[0][0] === undefined) {
        console.log(
          "This server doesn't have a bot added. To continue the procces you need yo add the bot in to youre desired server"
        );
      } else {
        console.log("Start adding procces");
      }
    });
  },
};
