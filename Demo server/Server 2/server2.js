const express = require("express");
const app = express();
const port = 4001;
const request = require("request");
const fetch = require("node-fetch");
const url = "http://localhost:4002/apiCall";

// -----------------------

//uses callback function, can't use promise-methods
request(url, (err, res, body) => {
  console.log("sending request.....\n");
  if(err) console.log(err);
  console.log(434,body,"\n\n");
});


//uses promise, can't use callback 
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(464,data,"\n\n");
  });

// ------------------
//to know the flow of this program

// console.log("follow the number to know the flow of program");
// console.log("0");

// const requestTest = async () => {
//   console.log("3");
//   const response = await new Promise((resolve, reject) => {
//     console.log("4");
//     console.log("sending request.....\n");
//     request(url, (err, res, body) => {
//       console.log("5");
//       if (err) {
//         console.log(err);
//         reject(err);
//       }
//       //   console.log(body);
//       resolve({ body: body, res: res });
//     });
//   });

//   return response;
// };

// var response;
// const send_request = async () => {
//   console.log("2");
//   response =await requestTest();
//   console.log("6");
//   console.log(response.body);
// };

// console.log("13");
// send_request();

// console.log("7");
// console.log(response);

// --------------------------

app.listen(port, () => {
  console.log("1");
  console.log(`Server listening on port ${port}`);
});
