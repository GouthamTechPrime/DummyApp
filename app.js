const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path : "./.env"});
const db = require("./connection/connection")
const port = 7000 || process.env.PORT;
const razorPay = require("./razorpay")
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api/razorpay",razorPay)
app.listen(port,()=>{console.log("Server running on port "+port)})