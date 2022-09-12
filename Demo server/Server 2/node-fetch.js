const express = require("express");
const app = express();
const port = 4003;

const fetch = require("node-fetch");
const url = "http://localhost:4002";

//default get request using then()/catch()
fetch(`${url}/apiCall`)
  .then((res) => {
    console.log("sending get request using then()/catch().......");
    console.log(res.status, res.statusText, "\n");
    return res.json();
  })
  .then((data) => {
    if (data) {
      console.log(data.response);
      console.log("\n\n");
    }
  })
  .catch((err) => {
    console.log(err);
    console.log("\n\n");
  });

//default get request using async/await and try/catch
const async_func = async () => {
  try {
    const responseData = await fetch(`${url}/apiCall`);
    console.log("sending get request using async/await and try/catch.......");
    console.log(responseData.status, responseData.statusText, "\n");
    const data = await responseData.json();
    console.log(data.response);
    console.log("\n\n");
  } catch (err) {
    console.log(err);
    console.log("\n\n");
  }
};
async_func();

//default get request with params using async/await and try/catch
const async_func2 = async () => {
  try {
    const responseData = await fetch(`${url}/apiParamsCall/Keshav/15`);
    console.log(
      "sending get request with params using async/await and try/catch......."
    );
    console.log(responseData.status, responseData.statusText, "\n");
    const data = await responseData.json();
    console.log(data.response);
    console.log("\n\n");
  } catch (err) {
    console.log(err);
    console.log("\n\n");
  }
};
async_func2();

//post request
const form_data = {
  name: "Keshav",
  age: 23,
  hobby: "to play tennis",
};
const async_func3 = async () => {
  try {
    const responseData = await fetch(`${url}/apiPostCall`, {
      method: "POST",
      body: JSON.stringify(form_data),
      headers: {
        "Content-type": "application/json",
      },
    });
    console.log("sending post request using async/await and try/catch.......");
    console.log(responseData.status, responseData.statusText, "\n");
    const data = await responseData.json();
    console.log(data.response);
    console.log("\n\n");
  } catch (err) {
    console.log(err);
  }
};
async_func3();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
