const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  isCreator: { type: DataTypes.BOOLEAN, defaultValue: false },
  wallet_balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
});

module.exports = User;
