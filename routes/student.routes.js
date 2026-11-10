const { addStudent, getStudent } = require("../controllers/student.controllers");

const studentRouter = require("express").Router();

studentRouter.post("/add", addStudent)
studentRouter.get("/all", getStudent)

module.exports = { studentRouter };