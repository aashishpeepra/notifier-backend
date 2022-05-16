const Event = require("../models/event");
const User = require("../models/user");
const HttpError = require("../models/http-Error");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const firebaseAdmin = require("firebase-admin")

async function createEvent(req, res, next) {
  // it will accept the event details along with clientPassword
  let { clientid } = req.params;
  const {email} = req.userData;
  let userExists = false;
  try {
    userExists = await User.findOne({ clientId: clientid });
  } catch (err) {
    console.error("WHILE FINDING EXISTING USERS IN DB", err);
    return next(
      new HttpError(`Can't find existing users. Plase try again`, 500)
    );
  }
  if (!userExists) {
    console.info(email, `USER DOESN'T EXISTS`);
    return next(new HttpError(`${email} doesn't exists in the database`, 403));
  }
  
  //checking if the user is authorized to add changes to events
  if(userExists.email != email){
    return next(new HttpError('You are not authorized to make changes in this client id',400));
  }
  
  // clientId is correct
  if (req.body.clientSecret != userExists.clientSecret) {
    return next(
      new HttpError("The clientId or clientSecret is incorrect", 400)
    );
  }


  //reaches here means everything is great. Now create new Event
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    emoji: req.body.emoji,
    triggeredOn: new Date(req.body.triggeredOn),
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await event.save({ session });
    await userExists.updateOne({clientId:clientid},{$push:{events:event}})
    
    await session.commitTransaction();
  } catch (err) {
    console.error("WHILE TRYING TO SAVE THE NEW EVENT ", err);
    return next(new HttpError(`Something went wrong. Try again`, 500));
  }

  // now the new event is saved in the database and also updated in the user's endpoint
  // next thing is to actually trigger the notification

  const message = {
    notification: {
      title: "🦄 " + req.body.title,
      body: req.body.description,
    },
    token: userExists.deviceId,
  };
  try {
    await firebaseAdmin.messaging().send(message);
  } catch (err) {
    console.error("WHILE SENDING THE ACTUAL NOTIFICATION", err);
    return next(
      new HttpError(`Couldn't send the notification. Try again`, 500)
    );
  }
  res.json({
    message: `Successfully sent the notification`,
  });
}

exports.createEvent = createEvent;
