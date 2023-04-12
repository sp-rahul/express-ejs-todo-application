
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./models/register-db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

module.exports = function register(req, res) {
   try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (!userExist) {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, email, password: hashedPassword };

      const row = await User.create(user);
      res.redirect("/login");
      //res.status(200).render("pages/login");
    } else {
        
      console.log("user already exist");
      //res.status(200).render("pages/register");
      res.redirect("/register");
    }
  } catch (e) {
    console.log(e.message);
  }
};