
const express = require("express");
const session = require("express-session");
const bodyPaser= require('body-parser')
const { User, Todo } = require("../models/User");

module.exports  = async (req, res, ) => {

const { todo, deleteIndex } = req.body;

  if (deleteIndex !== undefined) {
	  
	Todo.destroy({
    where: {
        id: deleteIndex
        }
   })
  } else if (todo !== "") {
    //todos.push(todo);
    const title = { item: todo, user_id: req.session.userId };
    await Todo.create(title);
  }

  res.redirect("/dashboard");
  
}