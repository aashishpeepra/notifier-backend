const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const HttpError = require("../models/http-Error");

async function signup(req,res,next){
    //This function will take the email and deviceId to sign up the user
    const {email,deviceId} = req.body;
    let userExists = false;
    try{
        userExists = await User.findOne({email:email})
    }catch(err){
        console.error("WHILE FINDING EXISTING USERS IN DB",err);
        return next(new HttpError(`Can't find existing users. Plase try again`,500))
    }
    if(userExists){
        console.info(email,'TRIED TO SIGN UP WHILE BEING AN EXISTING USER');
        return next(new HttpError(`${email} is an existing user. Maybe you want to sign in instead.`,403))
    }
    // if reaches here then the user doesn't exists
    const clientId = crypto.randomBytes(32).toString('hex');
    let clientPassword = crypto.randomBytes(32).toString('hex');
    userExists = new User({
        email,
        clientId,
        clientSecret:clientPassword,
        deviceId
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