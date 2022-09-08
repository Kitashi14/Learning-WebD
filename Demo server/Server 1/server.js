const express = require("express");
const app = express();
const port = 4002;

//adding a middleware for setting headers sent api requests from differnt origin for allowing its execution (for tackling CORS);
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

//     next();
//   });

var count = 0;
app.get("/apiCall", (req, res) => {
  const response = { hello: "brother" };

  count++;
  console.log("Got a request " + count);
  console.log({ response: response });
  console.log("\n\n");
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
