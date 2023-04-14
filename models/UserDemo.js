const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./config/database.sqlite",
});

const users = sequelize.define("user", {
   username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const lists = sequelize.define("list", {
  todo: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },

});


sequelize
  .sync()
  .then(() => {
    console.log("tables have been successfully created");
    //  return sequelize.drop();
  })
  .catch((e) => console.log(e));

module.exports = {
  users: users,
  lists: lists,
};
