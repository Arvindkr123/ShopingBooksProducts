const { Student } = require("../models/student.models")

const isValidId = (id) => /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0

const handleDatabaseError = (operation, error, res) => {
    console.error(`[DB] ${operation} failed:`, error.message)
    return res.status(500).json({ message: "Database operation failed" })
}

const addStudent = async (req, res) => {
    const { name, email, age } = req.body || {}
    if (!name || !email || age === undefined || age === null) {
        return res.status(400).json({ message: "Name, email, and age are required" })
    }

    try {
        const student = await Student.create({ name, email, age })
        console.info(`[DB] INSERT students succeeded (id=${student.id})`)
        return res.status(201).json({
            id: student.id,
            message: `Student added successfully with ${name}`
        })
    } catch (error) {
        return handleDatabaseError("INSERT students", error, res)
    }
}

const getStudent = async (req, res) => {
    try {
        const students = await Student.findAll()
        return res.status(200).json(students)
    } catch (error) {
        return handleDatabaseError("SELECT students", error, res)
    }
}

const getStudentById = async (req, res) => {
    const { id } = req.params
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Student ID must be a positive integer" })
    }

    try {
        const student = await Student.findByPk(Number(id))
        if (!student) {
            return res.status(404).json({ message: "Student not found" })
        }

        return res.status(200).json(student)
    } catch (error) {
        return handleDatabaseError(`SELECT students (id=${id})`, error, res)
    }
}

const updateStudent = async (req, res) => {
    const { id } = req.params
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Student ID must be a positive integer" })
    }

    const body = req.body || {}
    const updates = {}
    for (const field of ["name", "email", "age"]) {
        if (body[field] !== undefined) {
            updates[field] = body[field]
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Provide at least one field to update" })
    }

    try {
        const student = await Student.findByPk(Number(id))
        if (!student) {
            console.info(`[DB] UPDATE students found no student (id=${id})`)
            return res.status(404).json({ message: "Student not found" })
        }

        await student.update(updates)
        console.info(`[DB] UPDATE students succeeded (id=${id}, fields=${Object.keys(updates).length})`)
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
        const deletedCount = await Student.destroy({ where: { id: Number(id) } })
        if (deletedCount === 0) {
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
    getStudentById,
    updateStudent,
    deleteStudent
}