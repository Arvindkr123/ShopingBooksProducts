const { addUser, getUsers} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();


usersRouter.post("/", addUser)
usersRouter.get("/", getUsers)

module.exports = {
    usersRouter
}