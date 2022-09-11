const express = require("express");
const app = express();
const port = 4002;

//adding a middleware for setting headers sent api requests from differnt origin for allowing its execution (for tackling CORS);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// for parsering json file of type application/json (eg. forms recieved during post request)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// for forms with MIME type of application/x-www-form-urlencoded 
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var count = 0;

//simple rest api with get method
app.get("/apiCall", (req, res) => {
  const response = { response: "hello brother" };

  count++;
  console.log("Got request " + count);
  console.log(response);
  console.log("\n\n");
  res.status(200).json(response);
});

//simple post method rest api
app.post("/apiPostCall", (req, res) => {
  const { name, age, hobby } = req.body;

  count++;
  console.log("Got post request " + count);
  if (age < 0 || age > 150) {
    const response = { response: "Provide a valid age" };
    console.log(response);
    console.log("\n\n");
    res.status(422).json(response);
  } else {
    const response = {
      response: `My name is ${name}.\nI am of age ${age}.\nI like to ${hobby}.`,
    };
    console.log(response);
    console.log("\n\n");
    res.status(201).json(response);
  }
});

//simple get method with params rest api
app.get("/apiParamsCall/:name/:age", (req, res) => {
  const name = req.params.name;
  const age = req.params.age;

  count++;
  console.log("Got get request with params " + count);
  if (age < 0 || age > 150) {
    const response = { response: "Provide a valid age" };
    console.log(response);
    console.log("\n\n");
    res.status(422).json(response);
  } else {
    const response = { response: `My name is ${name}.\nI am of age ${age}.` };
    console.log(response);
    console.log("\n\n");
    res.status(201).json(response);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
