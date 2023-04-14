const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./models/register-db");

const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const LogoutHandler = require("./handlers/logout.js");
const registerHandler = require("./handlers/register.js");
const loginHandler = require("./handlers/login.js");
const isAuth = require("./middleware/auth.js");
const postController = require("./controllers/mycontroller.js");
const getController = require("./controllers/getController.js");

const port = 3000;

const { User, Todo } = require("./models/User");
const session = require("express-session");
const oneHour = 1000 * 60 * 60 ;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.use(
  sessions({
    key: "user_sid",
    secret: "this is random stuff",
    saveUninitialized: false,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);

app.get("/login", (req, res) => {
  res.render("pages/login");
});
app.post("/logout", LogoutHandler);
app.get("/register", async (req, res) => {
  res.render("pages/register");
});
app.post("/register",registerHandler);
app.post("/login",loginHandler);

app.get("/", isAuth, (req, res) => {
  // res.render("pages/index", { todos });
  res.redirect("/dashboard");
});

app.get("/dashboard", isAuth, getController);

//const todos= []
app.post("/dashboard", isAuth, postController);

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
