//extracting different modules
const cors = require("cors");

//extracting express module and setting server
const express = require("express");
const app = express();

//for parsering json file
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//for allowing cors request from client side
app.use(
  cors({
    //Sets Access-Control-Allow-Origin to the UI URI
    origin: "*",
    //Sets Access-Control-Allow-Credentials to true to recieve cookies
    credentials: true,
  })
);

//connecting to mongobd database server
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dbName = process.env.DBNAME;
mongoose
  .connect(
    `mongodb+srv://kitashi14:kitashi02@cluster0.rhccnpx.mongodb.net/urlShortner?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database\n");
  }).catch((err)=>{
    console.log(err.message);
  });

//setting the server port
const port = 4000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
