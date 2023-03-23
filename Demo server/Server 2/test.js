/** @format */

const express = require("express");
const app = express();
const port = 4003;

const fetch = require("node-fetch");
const url = "http://localhost:4002";

//demo data for testing
const name = "Rishav";
const name_with_space = "Rishav Raj";

// //get requests

// //no data send
// fetch(`${url}/test`)
//   .then((res) => {
//     console.log(res.status);
//   })
//   .catch((err) => {
//     console.log(err, "\n");
//   });

// //data send through query
// fetch(`${url}/test?name=${name_with_space}`)
//   .then((res) => {
//     console.log(res.status);
//   })
//   .catch((err) => {
//     console.log(err, "\n");
//   });

// //data send through params
// fetch(`${url}/test/${name_with_space}`)
//   .then((res) => {
//     console.log(res.status);
//   })
//   .catch((err) => {
//     console.log(err, "\n");
//   });

// //data send through body object (showed error : get request can't have a body)
// fetch(`${url}/test`, {
//   method: "GET",
//   body: JSON.stringify({
//     name: name_with_space,
//   }),
//   headers: {
//     "Content-type": "application/json",
//   },
// })
//   .then((res) => {
//     console.log(res.status);
//   })
//   .catch((err) => {
//     console.log(err, "\n");
//   });

// ----------------------------------------------------

//post requests

//no data send
fetch(`${url}/test`, {
  method: "POST",
})
  .then((res) => {
    console.log(res.status);
  })
  .catch((err) => {
    console.log(err, "\n");
  });

//data send through query
fetch(`${url}/test?name=${name_with_space}`, {
  method: "POST",
})
  .then((res) => {
    console.log(res.status);
  })
  .catch((err) => {
    console.log(err, "\n");
  });

//data send through params
fetch(`${url}/test/${name_with_space}`, {
  method: "POST",
})
  .then((res) => {
    console.log(res.status);
  })
  .catch((err) => {
    console.log(err, "\n");
  });

//data send through body object (json form)
fetch(`${url}/test`, {
  method: "POST",
  body: JSON.stringify({
    name: name_with_space,
  }),
  headers: {
    "Content-type": "application/json",
  },
})
  .then((res) => {
    console.log(res.status);
  })
  .catch((err) => {
    console.log(err, "\n");
  });

//data send through body object (urlencoded form)
fetch(`${url}/test`, {
  method: "POST",
  body: `name=${name_with_space}`,
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
  },
})
  .then((res) => {
    console.log(res.status);
  })
  .catch((err) => {
    console.log(err, "\n");
  });

//-------------------------------------------------

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
