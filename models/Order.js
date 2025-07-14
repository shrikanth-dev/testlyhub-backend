const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Test = require('./TestModel');


const Order = sequelize.define('Order', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, completed
});

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Test.hasMany(Order, { foreignKey: 'testId' });
Order.belongsTo(Test, { foreignKey: 'testId' });

module.exports = Order;
