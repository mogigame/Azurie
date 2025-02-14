const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Ban = sequelize.define('Ban', {
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
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Ban;