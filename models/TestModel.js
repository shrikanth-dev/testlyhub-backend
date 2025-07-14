const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Test = sequelize.define('Test', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  questions: { type: DataTypes.JSONB, allowNull: false },
  solutions: { type : DataTypes.JSONB, allowNull: false },
  duration: { type : DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'input' }, 
});

User.hasMany(Test, { foreignKey: 'creatorId' });
Test.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

module.exports = Test;
