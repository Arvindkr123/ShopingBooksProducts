const { addStudent, getStudent, getStudentById, updateStudent, deleteStudent } = require("../controllers/student.controllers");

const studentRouter = require("express").Router();

studentRouter.post("/", addStudent)
studentRouter.get("/", getStudent)
studentRouter.get("/:id", getStudentById)
studentRouter.put("/:id", updateStudent)
studentRouter.delete("/:id", deleteStudent)

module.exports = { studentRouter };