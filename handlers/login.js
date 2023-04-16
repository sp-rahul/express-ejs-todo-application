
const express = require("express");
const {User} = require("../models/User");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");


module.exports = async function login(req, res) {
    try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      const password_valid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (password_valid) {
        req.session.userId = user.id;

        return res.redirect("/",);
      } else {
        
        return res.redirect("/login");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (e) {
    console.log(e.message);
  }
};