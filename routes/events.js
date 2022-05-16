/**
 * These are the routes which will accept the events from the source. These needs to be a  little good
 */

const Router = require("express").Router();
const {createEvent}  =require("../controllers/event");
const firebaseAuthMiddleware = require("../middleware/firebaseAuth");

Router.use(firebaseAuthMiddleware)

Router.post("/create/:clientid",createEvent)

module.exports = Router;