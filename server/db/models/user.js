const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

var hasSecurePassword = function(user, options) {
	return new Promise((resolve, reject) => {
			if (user.password != user.password_confirmation) {
				reject("Password confirmation doesn't match Password");
			}
		
			bcrypt.hash(user.get('password'), 10, function(err, hash) {
				if (err) return reject(err);
				user.set('password_digest', hash);
				resolve();
			});
	})
};

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: Sequelize.STRING, field: 'first_name' },
    last_name: { type: Sequelize.STRING, field: 'last_name' },
    email: { type: Sequelize.STRING, field: 'email' },
    admin: { type: Sequelize.BOOLEAN, field: 'admin' },
    password_digest: {
  		type: Sequelize.STRING,
  		validate: {
  			notEmpty: true
  		}
  	},
    password: {
  		type: Sequelize.VIRTUAL,
  		allowNull: false,
  		validate: {
  			notEmpty: true,
  			len: [6, Infinity]
  		}
  	},
  	password_confirmation: {
  		type: Sequelize.VIRTUAL
  	}
  }, {
  	freezeTableName: true,
  	indexes: [{unique: true, fields: ['email']}],
    hooks: {
      beforeCreate: function(user) {
                    	user.email = user.email.toLowerCase();
                    	if (user.password) return hasSecurePassword(user);
                    },
      beforeUpdate: function(user) {
                  	user.email = user.email.toLowerCase();
                  	if (user.password) return hasSecurePassword(user);
                  }
    },
  	instanceMethods: {
  		authenticate: function(value) {
  			if (bcrypt.compareSync(value, this.password_digest))
  				return this;
  			else
  				return false;
  		}
  	}
	});
	
	User.prototype.authenticate = function (value) {
		if (bcrypt.compareSync(value, this.password_digest))
		return this;
	else
		return false;	
	}	

	return User;
};
