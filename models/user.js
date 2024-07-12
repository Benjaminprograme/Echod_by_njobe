const uniqId = require("uniqid");
const db = require("../utils/dataBase");
const bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = {
  save: (req, res, email, password) => {
    db.execute(
      "INSERT INTO users (id,email,password,isAuthenticated) VALUES (?,?,?,?)",
      [req.session.pendingAutherication.id, email, password, true]
    )
      .then(() => {
        req.session.user = {
          id: req.session.pendingAutherication.id,
        };
        req.session.pendingAutherication = null;
        req.session.save((err) => {
          if (err) {
            console.log("Error saving session:", err);
            res.redirect("/sign-up");
          } else {
            res.redirect("/");
          }
        });
      })
      .catch((err) => {
        console.log("Error during saving the user:", err);
        res.redirect("/sign-up");
      });
  },

  verifyAuthenticationCode: (req, res, authenticationCode) => {
    try {
      if (
        req.session.pendingAutherication &&
        req.session.pendingAutherication.authenticationCode ===
          authenticationCode
      ) {
        module.exports.save(
          req,
          res,
          req.session.pendingAutherication.email,
          req.session.pendingAutherication.password
        );
      } else {
        res.redirect("/sign-up");
      }
    } catch (err) {
      console.log("Error during verification:", err);
      res.redirect("/");
    }
  },

  generateAuthenticationCode: async (req, res, email, password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = uniqId();
    const authenticationCode = uniqId.time();
    try {
      db.execute("SELECT * FROM `users` WHERE `email` = ?", [email]).then(
        (resault) => {
          console.log(resault[0].length);
          if (resault[0].length === 0) {
            req.session.pendingAutherication = {
              id: userId,
              email: email,
              password: hashedPassword,
              authenticationCode: authenticationCode,
            };
            req.session.save((err) => {
              if (err) {
                console.log("Error saving session:", err);
                res.redirect("/sign-up");
              } else {
                res.redirect("/sign-up/authentication");
              }
            });
          } else {
            res.redirect("/sign-up");
          }
        }
      );
    } catch (err) {
      console.log("Error during generating authentication code:", err);
      req.session.destroy(() => {
        res.redirect("/sign-up");
      });
    }
  },

  validatePasswords: (req, res, email, password, repeatedPassword) => {
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
      req.session.user = null;
      req.session.save((err) => {
        if (err) {
          console.log("Error saving session:", err);
        }
        console.log("Password is not valid:", password, repeatedPassword);
        res.redirect("/sign-up");
      });
    }
  },

  signUp: (req, res, userData) => {
    db.execute("SELECT * FROM `sessions`").then((resault) => {
      console.log(resault);
    });
    console.log("Signing up the user");
    module.exports.validatePasswords(
      req,
      res,
      userData.email,
      userData.password,
      userData.repetedPassword
    );
  },

  logIn: (req, res, email, password) => {
    console.log("Logging in");
    db.execute("SELECT * FROM users WHERE email=? AND isAuthenticated = ?", [
      email,
      true,
    ])
      .then(async (resault) => {
        console.log("Checking data");
        if (await bcrypt.compare(password, resault[0][0].password)) {
          console.log("Logged in");
          req.session.user = {
            id: resault[0][0].id,
          };
          res.redirect("/");
        } else {
          console.log("Wrong password:", password, resault[0][0].password);
          res.redirect("/log-in");
        }
      })
      .catch((err) => {
        console.log("Error during login:", err);
        res.redirect("/");
      });
  },
};
