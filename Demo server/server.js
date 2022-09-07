const express = require("express");
const app = express();
const port = 4444;

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

app.get("/apiCall", (req, res) => {
  res.send({hello: "brother"});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
