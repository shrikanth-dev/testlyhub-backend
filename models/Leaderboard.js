const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Test = require('./TestModel');


const Leaderboard = sequelize.define('Leaderboard', {
  score: { type: DataTypes.INTEGER, allowNull: false },
  time_taken: { type: DataTypes.INTEGER, allowNull: false }, // seconds
});

User.hasMany(Leaderboard, { foreignKey: 'userId' });
Leaderboard.belongsTo(User, { foreignKey: 'userId' });

Test.hasMany(Leaderboard, { foreignKey: 'testId' });
Leaderboard.belongsTo(Test, { foreignKey: 'testId' });

module.exports = Leaderboard;
