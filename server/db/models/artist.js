const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('artist', 
  {
    id: { 
      type: Sequelize.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: { 
      type: Sequelize.STRING, 
      field: 'name' 
    },

    photo: { 
      type: Sequelize.BOOLEAN, 
      field: 'photo' 
    }    
  }, 

  {
    freezeTableName: true,
    
    indexes: [ 
      { 
        unique: true, 
        fields: ['name']
      }
    ],
  });
};
