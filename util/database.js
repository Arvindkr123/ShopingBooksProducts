const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_USER, process.env.MYSQL_ROOT, process.env.MYSQL_PASS, {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port:process.env.MYSQL_PORT
});

module.exports = sequelize;
