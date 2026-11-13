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
  const bootstrapConnection = mysql.createConnection(mysqlConfig).promise()

  try {
    await bootstrapConnection.query("CREATE DATABASE IF NOT EXISTS ??", [databaseName])
  } finally {
    await bootstrapConnection.end()
  }

  const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(50)
    )
  `
  const creatUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE
    );
  `

  const createBusesTable = `
    CREATE TABLE IF NOT EXISTS Buses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      busNumber VARCHAR(50) NOT NULL UNIQUE,
      totalSeats INT NOT NULL,
      availableSeats INT NOT NULL,
      
      CHECK (totalSeats > 0),
      CHECK (availableSeats >= 0),
      CHECK (availableSeats <= totalSeats)
    );
  `
  const createBookingTable = `
    CREATE TABLE IF NOT EXISTS Bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      seatNumber INT NOT NULL,

      userId INT NOT NULL,
      busId INT NOT NULL,

      FOREIGN KEY (userId) REFERENCES Users(id),
      FOREIGN KEY (busId) REFERENCES Buses(id),

      UNIQUE (busId, seatNumber)
  );
  `
  const createPaymentTable = `
    CREATE TABLE IF NOT EXISTS Payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amountPaid DECIMAL(10, 2) NOT NULL,
      paymentStatus ENUM(
          'PENDING',
          'SUCCESS',
          'FAILED',
          'REFUNDED'
      ) DEFAULT 'PENDING',

      bookingId INT NOT NULL UNIQUE,

      FOREIGN KEY (bookingId) REFERENCES Bookings(id),

      CHECK (amountPaid >= 0)
    );
  `
  await Promise.all([
    connection.promise().query(createStudentsTable),
    connection.promise().query(creatUsersTable),
    connection.promise().query(createBusesTable),
    connection.promise().query(createBookingTable),
    connection.promise().query(createPaymentTable),
  ])
})()

module.exports = { connection, ready }