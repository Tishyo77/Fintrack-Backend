const express = require("express");
const mongoose = require("mongoose");
userRoute = require("./controller/userRoute");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://fin_track:FinTrack252@fintrack.ntctjmm.mongodb.net/fintrackdb")
var db = mongoose.connection;
db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("Error occurred"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());
app.use("/userRoute", userRoute);

app.listen(4000, () =>{
    console.log("Server started at 4000");
})