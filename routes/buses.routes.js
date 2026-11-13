const { addBuses, availableSeats } = require('../controllers/buses.controllers');

const busesRouter = require('express').Router();



busesRouter.post("/", addBuses)
busesRouter.get("/available/:seats", availableSeats)

module.exports = {
    busesRouter
}