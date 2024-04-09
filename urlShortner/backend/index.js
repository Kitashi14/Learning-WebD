/** @format */

//extracting different modules
const cors = require("cors");

//extracting express module and setting server
const express = require("express");
const app = express();

//for allowing cors request from client side
app.use(
  cors({
    //Sets Access-Control-Allow-Origin to the UI URI
    origin: "*",
  })
);

//for parsering json file
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//connecting to mongobd database server
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(`mongodb://localhost:27017/urlShortner`)
  .then(() => {
    console.log("Connected to database\n");
  })
  .catch((err) => {
    console.log(err.message);
  });

//importing routes
const urlShortnerRoutes = require("./routes/router");

app.use("/api", urlShortnerRoutes);
app.get("/dummy", (req, res) => {
  res.status(200).json({ message: "hello" });
});

//setting the server port
const port = 6002;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
