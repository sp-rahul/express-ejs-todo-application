const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./models/register-db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const LogoutHandler = require('./handlers/logout.js');


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

// creating 24 hours from milliseconds
const fiveMin = 1000 * 60 * 5;

//session middleware
app.use(
  sessions({
    key: "user_sid",
    secret: "this is random stuff",
    saveUninitialized: false,
    cookie: { maxAge: fiveMin },
    resave: false,
  })
);

// //serving public file
 app.use(cookieParser());

// app.use((req, res, next) => {
//   if (req.session.user && req.cookie.user_sid) {
//     res.redirect("/");
//   }
//   next();
// });

// var sessionChecker = (req, res, next) => {
//   if (req.session.user && req.cookie.user_sid) {
//     res.redirect("/");
//   } else {
//     next();
//   }
// };

const isAuth = (req,res,next)=> {
  if(req.session.isAuth) {
    next()
  } else {
    res.redirect('/login')
  }
}

app.get("/login", (req, res) => {
	console.log(req.session)
  res.render("pages/login");
});

app.post('/logout', LogoutHandler);

app.get("/register", async (req, res) => {
  // const user = await User.findAll();
  // res.send(user)
  res.render("pages/register");
});

app.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (!userExist) {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, email, password: hashedPassword };

      const row = await User.create(user);
      return res.redirect("/login");
      
    } else {
        
      console.log("user already exist");
      //res.status(200).render("pages/register");
      return res.redirect("/register");
    }
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      const password_valid = await bcrypt.compare( req.body.password, user.password );
      if (password_valid) {
        //token = jwt.sign({ "id" : user.id,"email" : user.email,"first_name":user.first_name },process.env.SECRET);
        // res.status(200).json({ token : token });
        //res.status(200).json("Login successfully");
        req.session.isAuth = true;
        return res.redirect("/");
       // res.render("pages/index", { todos });
      } else {
		  res.send('alert("wrong password")');
        
        //res.status(400).json({ error : "Password Incorrect" });
        
		return res.redirect("/login");
        
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  } catch (e) {
    console.log(e.message);
  }
});





















const todos = [];

app.get("/", isAuth, (req, res) => {
  res.render("pages/index", { todos });
});

app.post("/", (req, res) => {
  const { todo, deleteIndex } = req.body;

  if (deleteIndex !== undefined) {
    todos.splice(deleteIndex, 1);
  } else if (todo !== "") {
    todos.push(todo);
  }

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
