const uniqId = require("uniqid");
const db = require("../utils/dataBase");
const bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = {
  deleteFromAuthericationCodeTable: (req, res) => {
    db.execute("DELETE FROM `authentication_codes` WHERE `user_id` = ?", [
      req.cookies.userId,
    ])
      .then((resault) => {
        console.log("Deleting user: ", resault);
        res.cookie("userId", "");
        if (resault[0].affectedRowsc === 0) {
          console.log("There is no user to delete");
        } else {
          res.redirect("/");
        }
      })
      .catch((err) => {
        console.log("There was an error deletnig the user: ", err);
      });
  },
  save: (req, res, email, password) => {
    db.execute(
      "INSERT INTO `users` (`id`,`email`,`password`,`isAuthenticated`) VALUES (?,?,?,?)",
      [req.cookies.userId, email, password, true]
    )
      .then(() => {
        res.cookie("authenticatedId", req.cookies.userId);
        module.exports.deleteFromAuthericationCodeTable(req, res);
      })
      .catch((err) => {
        if (err) {
          console.log("There was an erro during saving the user: ", err);
          module.exports.deleteFromAuthericationCodeTable(req, res);
        }
      });
  },
  verifyAuthenticationCode: (req, res, authenticationCode) => {
    db.execute(
      "SELECT * FROM `authentication_codes` WHERE `authentication_code` = ? AND `user_id` = ?",
      [authenticationCode, req.cookies.userId]
    )
      .then((resault) => {
        console.log("Verifiying autherication code");
        if (resault[0][0] === undefined) {
          module.exports.deleteFromAuthericationCodeTable(req, res);
        } else {
          module.exports.save(
            req,
            res,
            resault[0][0].email,
            resault[0][0].password
          );
        }
      })
      .catch((err) => {
        if (err) {
          console.log(
            "There was an erorr while verifying the autherication code: ",
            err
          );
        }
      });
  },
  generateAuthenticationCode: async (req, res, email, password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = await uniqId();
    const authenticationCode = await uniqId.time();

    db.execute(
      "INSERT INTO `authentication_codes` (`user_id`, `email`, `password`, `authentication_code`) VALUES (?, ?, ?, ?)",
      [userId, email, hashedPassword, authenticationCode]
    )
      .then(() => {
        console.log("Saving data in to autherication_codes");
        res.cookie("userId", userId);
        res.redirect("/sign-up/authentication");
      })
      .catch((err) => {
        if (err) {
          res.cookie("authenticatedId", "");
          res.cookie("userId", "");
          console.log("Error was founde during sign up: ", err);
          res.redirect("/sign-up");
        }
      });
  },

  validatePassword: (req, res, email, password, repeatedPassword) => {
    console.log("Validating password");
    if (
      password.length >= 8 &&
      password === repeatedPassword &&
      /\d/.test(password) &&
      password.toLowerCase() !== password &&
      password.toUpperCase() !== password
    ) {
      console.log("Password is valid");
      module.exports.generateAuthenticationCode(req, res, email, password);
    } else {
      res.cookie("authenticatedId", "");
      res.cookie("userId", "");
      console.log("Password is not valid:", password, repeatedPassword);
      res.redirect("/sign-up");
    }
  },

  signUpUser: (req, res, userData) => {
    console.log("Signing up the user");
    module.exports.validatePassword(
      req,
      res,
      userData.email,
      userData.password,
      userData.repetedPassword
    );
  },
};
