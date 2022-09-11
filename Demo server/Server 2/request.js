const express = require("express");
const app = express();
const port = 4001;
const request = require("request");
const url = "http://localhost:4002";

//default get request
request(`${url}/apiCall`, (err, res, body) => {
  console.log("sending get request with default method.....");
  if (err) console.log(err);
  else {
    console.log(res.statusCode, res.statusMessage);
    if (res.statusCode < 205) {
      data = JSON.parse(body);
      console.log(data.response);
    } else console.log(body);
  }
  console.log("\n");
});

//get request with options method
let options = {
  url: `${url}/apiCall`,
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};
request(options, (err, res, body) => {
  console.log("\nsending get request with options method.....");
  if (err) console.log(err);
  else {
    console.log(res.statusCode, res.statusMessage);
    if (res.statusCode < 205) {
      data = JSON.parse(body);
      console.log(data.response);
    } else console.log(body);
  }
  console.log("\n");
});

//get request with .get method
options = {
  url: `${url}/apiCall`,
  headers: {
    Accept: "application/json",
  },
};
request.get(options, (err, res, body) => {
  console.log("\nsending get request with .get method.....");
  if (err) console.log(err);
  else {
    console.log(res.statusCode, res.statusMessage);
    if (res.statusCode < 205) {
      data = JSON.parse(body);
      console.log(data.response);
    } else console.log(body);
  }
  console.log("\n");
});

//get request with params
request(`${url}/apiParamsCall/Keshav/16`, (err, res, body) => {
  console.log("\nsending get request with params.....");
  if (err) console.log(err);
  else {
    console.log(res.statusCode, res.statusMessage);
    if (res.statusCode < 205) {
      data = JSON.parse(body);
      console.log(data.response);
    } else console.log(body);
  }
  console.log("\n");
});

//post request with .post method
let data = {
  name: "Keshav",
  age: 14,
  hobby: "play football",
};
options = {
  url: `${url}/apiPostCall`,
  form: data,
};
// options = {
//   url: `${url}/apiPostCall`,
//   body: JSON.stringify(data),
//   headers: { "content-type": "application/json" },
// };
request.post(options, (err, res, body) => {
  console.log("\nsending post request with .post method.....");
  if (err) console.log(err);
  else {
    console.log(res.statusCode, res.statusMessage);
    if (res.statusCode < 205) {
      data = JSON.parse(body);
      console.log(data.response);
    } else console.log(body);
  }
  console.log("\n");
});

app.listen(port, () => {
  console.log("1");
  console.log(`Server listening on port ${port}`);
});
