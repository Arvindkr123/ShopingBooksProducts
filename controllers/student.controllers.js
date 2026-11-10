const { connection } = require("../util/database")
const db = connection.promise()

const isValidId = (id) => /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0

const handleDatabaseError = (operation, error, res) => {
    console.error(`[DB] ${operation} failed:`, error.message)
    return res.status(500).json({ message: "Database operation failed" })
}

const addStudent = async (req, res) => {
    const { name, email } = req.body || {}
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" })
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO students (name, email) VALUES (?, ?)",
            [name, email]
        )
        console.info(`[DB] INSERT students succeeded (id=${result.insertId})`)
        return res.status(201).json({
            id: result.insertId,
            message: `Student added successfully with ${name}`
        })
    } catch (error) {
        return handleDatabaseError("INSERT students", error, res)
    }
}

const getStudent = async (req, res) => {
    try {
        const [students] = await db.query("SELECT * FROM students")
        return res.status(200).json(students)
    } catch (error) {
        return handleDatabaseError("SELECT students", error, res)
    }
}

const updateStudent = async (req, res) => {
    const { id } = req.params
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Student ID must be a positive integer" })
    }

    const { name, email } = req.body || {}
    const fields = []
    const values = []

    if (name !== undefined) {
        fields.push("name = ?")
        values.push(name)
    }
    if (email !== undefined) {
        fields.push("email = ?")
        values.push(email)
    }
    if (fields.length === 0) {
        return res.status(400).json({ message: "Provide at least one field to update" })
    }

    values.push(Number(id))
    try {
        const [result] = await db.execute(
            `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
            values
        )

        if (result.affectedRows === 0) {
            const [students] = await db.execute("SELECT id FROM students WHERE id = ?", [Number(id)])
            if (students.length === 0) {
                console.info(`[DB] UPDATE students found no student (id=${id})`)
                return res.status(404).json({ message: "Student not found" })
            }
            console.info(`[DB] UPDATE students made no changes (id=${id})`)
            return res.status(200).json({ message: "Student already has the requested values" })
        }

        console.info(`[DB] UPDATE students succeeded (id=${id}, fields=${fields.length})`)
        return res.status(200).json({ message: "Student updated successfully" })
    } catch (error) {
        return handleDatabaseError(`UPDATE students (id=${id})`, error, res)
    }
}

const deleteStudent = async (req, res) => {
    const { id } = req.params
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Student ID must be a positive integer" })
    }

    try {
        const [result] = await db.execute("DELETE FROM students WHERE id = ?", [Number(id)])
        if (result.affectedRows === 0) {
            console.info(`[DB] DELETE students found no student (id=${id})`)
            return res.status(404).json({ message: "Student not found" })
        }

        console.info(`[DB] DELETE students succeeded (id=${id})`)
        return res.status(200).json({ message: `Student with ID ${id} deleted successfully` })
    } catch (error) {
        return handleDatabaseError(`DELETE students (id=${id})`, error, res)
    }
}

module.exports = {
    addStudent,
    getStudent,
    updateStudent,
    deleteStudent
}