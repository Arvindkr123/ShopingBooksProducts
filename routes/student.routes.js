const { addStudent, getStudent, updateStudent, deleteStudent } = require("../controllers/student.controllers");

const studentRouter = require("express").Router();

studentRouter.post("/add", addStudent)
studentRouter.get("/all", getStudent)
studentRouter.put("/:id", updateStudent)
studentRouter.delete("/:id", deleteStudent)

module.exports = { studentRouter };