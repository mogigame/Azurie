const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Suggestion = sequelize.define('Suggestion', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // 'pending', 'accepted', 'rejected'
  },
});

module.exports = Suggestion;