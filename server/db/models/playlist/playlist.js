const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('playlist', 
  {
    id: { 
      type: Sequelize.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: { 
      type: Sequelize.STRING, 
      field: 'name' 
    }
  }, 
  
  {
    freezeTableName: true
  });
};
