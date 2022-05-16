//Authenticating routes on the basis of idToken

const HttpError = require("../models/http-Error");
const { firebaseApp } = require("../index");

async function firebaseAuthMiddleware(req, res, next) {
  try {
    let headers = req.headers.authorization;
    console.log(req.headers)
    if (!headers) {
      return next(
        new HttpError(
          "Authorization is missing. The fuck you trying to hack us or something?",
          400
        )
      );
    }
    let token = headers.split(" ")[1];
    let user;
    console.log(token)
    try {
      user = await firebaseApp.auth().verifyIdToken(token);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
    console.log(user)
    if (!user) {
      return next(new HttpError(`Not authenticated.`, 400));
    }
    req.userData = user;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = firebaseAuthMiddleware