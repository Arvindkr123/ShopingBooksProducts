const {connection} = require('../util/database')
const db = connection.promise();

const handleDatabaseError = (operation, error, res) => {
    console.error(`[DB] ${operation} failed:`, error.message)
    return res.status(500).json({ message: "Database operation failed" })
}

const addBuses = async (req, res) => {
    const { busNumber, totalSeats,availableSeats } = req.body;
    if (!busNumber || !totalSeats || !availableSeats) {
        return res.status(400).json({ message: "busNumber and totalSeats or availableSeats are required" })
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)",
            [busNumber, totalSeats, availableSeats]
        )
        console.info(`[DB] INSERT buses succeeded (id=${result.insertId})`)
        return res.status(201).json({
            id: result.insertId,
            message: `bus added successfully with ${busNumber}`
        })
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong while adding the bus"
        })
    }
}

const availableSeats = async (req, res) => {
    try {
        const seats = Number(req.params.seats);

        if (!Number.isInteger(seats) || seats < 0) {
            return res.status(400).json({ message: "seats must be a non-negative integer" });
        }

        const [seatsData] = await db.query(
            "SELECT * FROM Buses WHERE availableSeats = ?",
            [seats]
        );

        return res.status(200).json(seatsData);
    } catch (error) {
        return handleDatabaseError("SELECT buses", error, res);
    }
};

module.exports = {
    addBuses,
    availableSeats
}