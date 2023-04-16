
const express = require("express");
const {User} = require("../models/User");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");


module.exports = async function  register(req, res) {
    try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (!userExist) {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, email, password: hashedPassword };

      const row = await User.create(user);
      return res.redirect("/login", );
    } else {
      console.log("user already exist");
      //alert('The name already exist')
      //throw new Error('Email already in use')

      //res.status(200).render("pages/register");
      
      return res.redirect("/register");
    }
  } catch (e) {
    console.log(e.message);
  }
};