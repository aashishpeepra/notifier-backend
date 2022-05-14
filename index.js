const express = require("express");
const cors = require("cors");
const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const firebaseCreds = require("./firebase.json");

firebaseAdmin.initializeApp({
    credential:firebaseAdmin.credential.cert(firebaseCreds)
})


const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended:true}));

//check the health of the system. If it's up
server.get("/",(req,res,_)=>{
    res.json({message:'Server is up and running on port '+PORT});
})

//Importing user defined routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/client");
const eventRoutes = require("./routes/events");

server.use(adminRoutes);
server.use("/api/v1/client", userRoutes);
server.use("/api/v1/event",eventRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL).then(()=>{
    
    server.listen(PORT,()=>{
        console.log("STARTED LISTENING ON ",PORT);
    })

}).catch(err=>{
    console.error("WHILE TRYING TO CONNECT TO MONGODB",err)
})
