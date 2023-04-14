const express = require("express");
const session = require("express-session");
const {User} = require("../models/User");

module.exports  = async (req, res, next) => {
  if (req.session.userId) {
    const exitingUser = await User.findOne({
      where: { id: req.session.userId },
    });
    if (exitingUser) {
      next();
    } else {
      throw new Error("User not found");
    }
  } else {
    res.redirect("/login");
  }
};
