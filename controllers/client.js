const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const HttpError = require("../models/http-Error");
const {firebaseApp} = require("../index");

async function signup(req,res,next){
    //This function will take the email and deviceId to sign up the user
    const {idToken} = req.body;
    // idToken is going to be firebase user id Token
    let firebaseUser = false;
    try{
        firebaseUser =  await firebaseApp.auth().verifyIdToken(idToken);
    }catch(err){
        console.error("WHILE TRYING TO VERIFY THE FIREBASE ID TOKEN",err);
        return next(new HttpError(`Can't verify the firebase id token. Simply try again`,500));
    }
    console.log(firebaseUser)
    if(!firebaseUser){
        return next(new HttpError(`Provided token is not a valid firebase id token`,400))
    }
    let email = firebaseUser.email;
    let userExists = false;
    try{
        userExists = await User.findOne({email:email})
    }catch(err){
        console.error("WHILE FINDING EXISTING USERS IN DB",err);
        return next(new HttpError(`Can't find existing users. Plase try again`,500))
    }
    if(userExists){
        res.json({
            message:"Successfully logged in user",
            data:userExists
        })
        return;
    }
    // if reaches here then the user doesn't exists
    const clientId = crypto.randomBytes(32).toString('hex');
    let clientPassword = crypto.randomBytes(32).toString('hex');
    userExists = new User({
        email,
        clientId,
        clientSecret:clientPassword
    })
    try{
        await userExists.save()
    }catch(err){
        console.error("WHILE TRYING TO SAVE THE NEW USER ",email,err)
        return next(new HttpError(`Something went wrong. Try again`,500))
    }
    res.json({
        message:'Successfully created new user',
        data:userExists
    })   
}

async function deleteToken(req,res,next){
    const {email} = req.body;
    let userExists = false;
    try{
        userExists = await User.findOne({email:email})
    }catch(err){
        console.error("WHILE FINDING EXISTING USERS IN DB",err);
        return next(new HttpError(`Can't find existing users. Plase try again`,500))
    }
    if(!userExists){
        console.info(email,`USER DOESN'T EXISTS`);
        return next(new HttpError(`${email} doesn't exists in the database`,403))
    }
    // email exists and now have to disable the tokens
   
    try{
        await userExists.updateOne({email},{clientId:"",clientPassword:""})
    }catch(err){
        console.error("WHILE TRYING TO SAVE HTE USER ",email,err)
        return next(new HttpError(`Something went wrong. Try again`,500))
    }
    res.json({
        message:`successfully deleted the user's tokens`
    })
}

async function regenerateToken(req,res,next){
    let {email} = req.body;
    let userExists = false;
    try{
        userExists = await User.findOne({email:email})
    }catch(err){
        console.error("WHILE FINDING EXISTING USERS IN DB",err);
        return next(new HttpError(`Can't find existing users. Plase try again`,500))
    }
    if(!userExists){
        console.info(email,`USER DOESN'T EXISTS`);
        return next(new HttpError(`${email} doesn't exists in the database`,403))
    }
    // email exists and now have to disable the tokens
    const clientId = crypto.randomBytes(32).toString('hex');
    let clientPassword = crypto.randomBytes(32).toString('hex');
    
    
    try{
        await User.updateOne({email},{clientId,clientPassword:clientPassword})
    }catch(err){
        console.error("WHILE TRYING TO SAVE THE NEW USER ",email,err)
        return next(new HttpError(`Something went wrong. Try again`,500))
    }
    res.json({
        message:'Successfully created new tokens for the user',
        data:userExists
    })
}

exports.signup = signup
exports.deleteToken = deleteToken
exports.regenerateToken = regenerateToken;