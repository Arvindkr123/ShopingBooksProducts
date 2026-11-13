const mysql = require("mysql2")

const databaseName = process.env.MYSQL_DB_NAME

if (!databaseName) {
  throw new Error("MYSQL_DB_NAME must be set")
}

const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS
}

const connection = mysql.createPool({
  ...mysqlConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const ready = (async () => {
  const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      email VARCHAR(100) Unique,
      age int
    )
  `
  await Promise.all([
    connection.promise().query(createStudentsTable),
  ])
})()

module.exports = { connection, ready }