const express = require("express");
const app = express();

const path = require("path");
app.use(express.static(path.join("public")));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const session = require("express-session");
app.use(
  session({
    secret: "my_secret_key_shhhhh",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//Routes
const logInRoute = require("./routes/registerRoutes/logIn");
app.use(logInRoute);

const signUpRoute = require("./routes/registerRoutes/signUp");
app.use(signUpRoute);

const homeRoute = require("./routes/mainRoutes/home");
app.use(homeRoute);

app.listen(3000);
