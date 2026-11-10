require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { connection, ready } = require('./util/database');
const { studentRouter } = require('./routes/student.routes');

const app = express();
const port = process.env.PORT;
let server;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.use("/student", studentRouter)

ready
    .then(() => {
        server = app.listen(port, () => {
            console.log("server is running");
        })
    })
    .catch((err) => {
        console.error("Database initialization failed:", err)
        connection.end(() => {
            process.exitCode = 1
        })
    })

const shutdown = () => {
    const closeDatabase = () => {
        connection.end((err) => {
            if (err) {
                console.error("Database shutdown failed:", err)
                process.exitCode = 1
            }
        })
    }

    if (server) {
        server.close(closeDatabase)
    } else {
        closeDatabase()
    }
}

process.once("SIGINT", shutdown)
process.once("SIGTERM", shutdown)
