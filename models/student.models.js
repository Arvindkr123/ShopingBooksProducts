const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Student = sequelize.define('Student', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  age: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = { Student };