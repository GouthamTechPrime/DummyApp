const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://gouthamp0306:g0gupHjjQnwRTpUm@cluster0.ls21ks4.mongodb.net/").then((data)=>{console.log("Connected to db")}).catch((err)=>{console.log("Error Occurred while connecting to db"+err)})