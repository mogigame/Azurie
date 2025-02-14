const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Warn = sequelize.define('Warn', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moderatorId: {
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

module.exports = Warn;