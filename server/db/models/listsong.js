const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('listsong', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    order: { type: Sequelize.INTEGER }
  }, {
    freezeTableName: true
  });
};
