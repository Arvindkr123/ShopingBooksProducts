const mysql = require("mysql2")

const databaseName = process.env.MYSQL_DB_NAME

if (!databaseName) {
  throw new Error("MYSQL_DB_NAME must be set")
}

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS
})

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err)
    return;
  }
  console.log("MySQL connection established")

  connection.query("CREATE DATABASE IF NOT EXISTS ??", [databaseName], (err) => {
    if (err) {
      console.error(`Could not create database "${databaseName}":`, err)
      return;
    }

    connection.changeUser({ database: databaseName }, (err) => {
      if (err) {
        console.error(`Could not select database "${databaseName}":`, err)
        return;
      }

      const createStudentsTable = `
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(20),
          email VARCHAR(20)
        )
      `

      connection.query(createStudentsTable, (err) => {
        if (err) {
          console.error(`Could not create table in "${databaseName}":`, err)
          return;
        }
        console.log(`Database "${databaseName}" is ready`)
      })
    })
  })
})

module.exports = { connection }