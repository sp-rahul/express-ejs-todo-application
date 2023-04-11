const {Model, DataTypes} = require('sequelize');
const sequelize = require('./register-db');
const bcrypt = require('bcrypt')




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

User.init({
	username : {
		type: DataTypes.STRING
	},
	email : {
		type: DataTypes.STRING
	},
	password: {
		type: DataTypes.STRING
	} 
}, {
	sequelize,
	modelName: 'user',
	
	
	
});

module.exports = User;