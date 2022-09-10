//A-1 start ------------------------->
//in this method it didn't executed till last

// console.log("Start");

// const convertToRs = (dollar) => {
//   if (typeof dollar === "number") {
//     return dollar * 64;
//   } else {
//     throw Error("Amount need to be in number.");
//   }
// };

// const myValue = convertToRs("five");

// console.log(myValue);

// console.log("Executed till last");
// console.log("End");

//A-1 end ----------------------->

//A-2 start -------------------------->
// using try-catch

// console.log("Start");

// const convertToRs = (dollar) => {
//   if (typeof dollar === "number") {
//     return dollar * 64;
//   } else {
//     throw Error("Amount need to be in number.");
//   }
// };

// try {
//   const myValue = convertToRs("five");

//   console.log(myValue);
// } catch (error) {
//   // console.log(error.message);
//   console.log(error);
// }

// console.log("Executed till last");
// console.log("End");

//A-2 end ---------------------------->

//A-3 start -------------------------->
// using fetch

// console.log("start");

// fetch("https://jsonplaceholder.typicode.com/users")
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((err) => {
//     console.error(err);
//   });

//   console.log("here");

// break

// console.log("start");
// const res = fetch("https://jsonplaceholder.typicode.com/users")
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

// console.log(res);
// console.log("here");

//break

console.log("start");

const f = async () => {
  const res = await fetch("http://localhost:4002/apiCall");
  data = await res.json();
  console.log(data);
  return;
};

const fun = async () => {
  await f();
  console.log("here");
};

fun();

//break

// console.log("start");

// const f = async () => {
//   console.log("Fake Start");
//   const res = await fetch("https://jsonplaceholder.typicode.com/users");
//   data = await res.json();
//   console.log(data);
//   console.log("Fake end");
// };

// f();

// console.log("end");
//A-3 end ---------------------------->
