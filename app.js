const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mySQLStore = require("express-mysql-session")(session);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "damir1611",
  database: "echod_data_base",
  charset: "utf8mb4_bin",
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

const mysql = require("mysql2");
const pool = mysql.createPool(options).promise();

const sessionStore = new mySQLStore({}, pool);

app.use(
  session({
    secret: "my_secret_key_shhhhh",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, maxAge: 3 * 24 * 60 * 60 * 1000 }, // 3 days
  })
);

sessionStore
  .onReady()
  .then(() => {
    console.log("Session store is ready");
  })
  .catch((err) => {
    console.error(err);
  });

// Routes
const logInRoute = require("./routes/registerRoutes/logIn");
const signUpRoute = require("./routes/registerRoutes/signUp");
const addServerRoute = require("./routes/secondaryRoutes.js/addServer");
const homeRoute = require("./routes/mainRoutes/home");

app.use(logInRoute);
app.use(signUpRoute);
app.use(addServerRoute);
app.use(homeRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
