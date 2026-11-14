require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const { studentRouter } = require('./routes/student.routes');


const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use("/students", studentRouter)

sequelize.sync({ force: false }).then(() => {
    const startServer = async () => {
        try {
            // await sequelize.authenticate();
            app.listen(port, () => {
                console.log("server is running");
            });
        } catch (error) {
            console.error("Database connection failed:", error);
            process.exitCode = 1;
        }
    };
    startServer();
}).catch((err) => {
    console.log(err);
})

