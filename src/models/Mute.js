const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Mute = sequelize.define('Mute', {
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
  duration: {
    type: DataTypes.INTEGER, // Durée en minutes
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Mute;