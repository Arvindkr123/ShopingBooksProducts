const { connection } = require('../util/database')
const db = connection.promise()

const handleDatabaseError = (operation, error, res) => {
    console.error(`[DB] ${operation} failed:`, error.message)
    return res.status(500).json({ message: "Database operation failed" })
}


const addUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" })
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Users (name, email) VALUES (?, ?)",
            [name, email]
        )
        console.info(`[DB] INSERT usrers succeeded (id=${result.insertId})`)
        return res.status(201).json({
            id: result.insertId,
            message: `Student added successfully with ${name}`
        })
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong while adding the user"
        })
    }
}
const getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM Users")
        return res.status(200).json(users)
    } catch (error) {
        return handleDatabaseError("SELECT students", error, res)
    }
}

module.exports = {
    addUser,
    getUsers
}