console.log("Start");

// returning an array
const dosomething = () => ["Ashish", 24];

// way to store the returning array of a func
const [name, age] = dosomething();

console.log("Name : " + name);
console.log("Age : " + age);

// setTimeout( cb = ()=>{}, 5000);
setTimeout(
  // here cb is a callback function in setTimeout() func
  (cb = () => {
    console.log("Callback executed");
  }),
  5000
);

document.querySelector("button").addEventListener(
  "click",
  (cb = () => {
    console.log("Callback clicked");
  })
);

//all callback queue and microtask queie are executed only when the call stack is empty;

//A-1 start ------------->

var c;
for (i = 0; i < 20000; i++) {
  console.log(c);
}

//A-1 end ------------------>

//A-2 start ------------------>

// var c = 0;
// for (i = 0; i < 200000000; i++) {
//   c = i;
// }
// console.log(c);

//A-2 end ---------------------------->

//microtask queue is used for storing callback from a promises

//this fetch api is not explained only for showing microtask queue perference
fetch("https://dad-jokes.p.rapidapi.com/random/joke", {
  method: "GET",
  headers: {
    "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
    "x-rapidapi-key": "b1220065e9mshcaf68176e9e7117p189309jsna71b706c5b70",
  },
})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.error(err);
  });

console.log("End");
