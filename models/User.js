const { Model, DataTypes } = require("sequelize");
const sequelize = require("./register-db");

// module.exports = function(sequelize, DataTypes) {
//     const User = sequelize.define('users', {
// 		username : {
// 			type: DataTypes.STRING
// 		},
// 		email : {
// 			type: DataTypes.STRING
// 		},
// 		password: {
// 			type: DataTypes.STRING
// 		}
//     }, {
//         freezeTableName: true,
//         instanceMethods: {
//             generateHash(password) {
//                 return bcrypt.hash(password, bcrypt.genSaltSync(8));
//             },
//             validPassword(password) {
//                 return bcrypt.compare(password, this.password);
//             }
//         }
//     });

//     return User;
// }

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

class Todo extends Model {}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize,
    modelName: "todo",
  }
);

Todo.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Todo, { foreignKey: 'user_id' });

module.exports = {
  User,
  Todo,
};
