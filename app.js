require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const {connection} = require('./util/database');
const { studentRouter } = require('./routes/student.routes');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use("/student", studentRouter)

app.listen(port, () => {
    console.log("server is running");
})
