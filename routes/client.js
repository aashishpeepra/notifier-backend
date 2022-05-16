/**
 * Client routes are for authentication and other client meta info related inputs
 */

const Router = require("express").Router();
const {signup,deleteToken,regenerateToken,signup_mobile} = require('../controllers/client');
const firebaseAuthMiddleware = require("../middleware/firebaseAuth");


//Adding route protection
Router.use(firebaseAuthMiddleware)


Router.post("/signup_mobile",signup_mobile)
Router.post("/signup",signup);
Router.delete('/deleteToken',deleteToken);
Router.post('/regenerateToken',regenerateToken)
module.exports = Router;