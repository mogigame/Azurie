const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Report = sequelize.define('Report', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reporterId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Report;