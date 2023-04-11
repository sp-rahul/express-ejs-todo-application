const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
   'register_db',
   'user',
   'password',
    {
		dialect: 'sqlite',
      host: './config/users-db.sqlite'
      
    }
  );
  
  module.exports = sequelize;


