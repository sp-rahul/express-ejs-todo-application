const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./models/register-db");
const { check, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
//const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const LogoutHandler = require("./handlers/logout.js");
//const registerHandler = require("./handlers/register.js");
//const loginHandler = require("./handlers/login.js");
const isAuth = require("./middleware/auth.js");
//const postController = require("./controllers/mycontroller.js");
//const getController = require("./controllers/getController.js");

const port = 3000;

const { User, Todo } = require("./models/User");
const session = require("express-session");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const oneHour = 1000 * 60 * 60;
const app = express();

app.use(express.static("public"));
app.use(urlencodedParser);
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

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post(
  "/register",
  [
    check("username", "This username must be 3+ character long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("pages/register", {
        alert,
      });
    }

    try {
      const userExist = await User.findOne({
        where: { email: req.body.email },
      });
      if (!userExist) {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, email, password: hashedPassword };

        const row = await User.create(user);
        return res.redirect("/login");
      } else {
        console.log("user already exist");
        //alert('The name already exist')
        //throw new Error('Email already in use')

        //res.status(200).render("pages/register");
       
         // check("email", "Email already exists").isEmail().normalizeEmail();

        //const errors = validationResult(req);

        
          //return res.status(422).jsonp(errors.array())
          //const alert = errors.array('Email already exists');
         //const alert = errors.push("Code is too short!")
         err_msg = "This user already exists.";
         return res.render('pages/register', { err_msg: err_msg } );

          // res.render("pages/register", {
          //   alert,
          // });
        

        //  return res.redirect("/register");
      }
    } catch (e) {
      err_msg = "Some error occured , plz register again.";
      return res.render('pages/register', { err_msg: err_msg } );
    }
  }
);

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      const password_valid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (password_valid) {
        req.session.userId = user.id;

        return res.redirect("/");
      } else {
        //window.alert("Hello world!1");
        // alert("Hello world!");
        err_msg = "Incorrect password";
        return res.render('pages/login', { err_msg: err_msg } );

        //return res.redirect("/login");
      }
    } else {
      err_msg = "This Email is not registered";
      return res.render('pages/login', { err_msg: err_msg } );
      //return res.redirect("/login");
    }
  } catch (e) {
    console.log(e.message);
  }
});

app.get("/", isAuth, (req, res) => {
  // res.render("pages/index", { todos });
  res.redirect("/dashboard");
});

app.get("/dashboard", isAuth, async (req, res) => {
  const todos = await Todo.findAll({
    where: {
      user_id: req.session.userId,
    },
    raw: true,
  });
  console.log("todos : ", todos);

  res.render("pages/index", { todos });
});

//const todos= []
app.post("/dashboard", isAuth, async (req, res) => {
  const { todo, deleteIndex } = req.body;

  if (deleteIndex !== undefined) {
    Todo.destroy({
      where: {
        id: deleteIndex,
      },
    });
  } else if (todo !== "") {
    //todos.push(todo);
    const title = { item: todo, user_id: req.session.userId };
    await Todo.create(title);
  }

  res.redirect("/dashboard");
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
