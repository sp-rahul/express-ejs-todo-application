
const express = require("express");
const session = require("express-session");
const bodyPaser= require('body-parser')
const { User, Todo } = require("../models/User");

module.exports  = async (req, res, ) => {
const todos = await Todo.findAll({
    where: {
      user_id: req.session.userId,
    },
    raw: true,
  });
  console.log("todos : ", todos);

  res.render("pages/index", { todos });
  
}
