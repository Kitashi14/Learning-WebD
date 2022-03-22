//A-1 start ------------------------->

// const first = () => {
//   console.log("One");
// };

// const second = () => {
//   setTimeout(() => {
//     console.log("timer callback done");
//   }, 3000);
//   console.log("Two");
// };

// const third = () => {
//   console.log("Three");
// };

// first();
// second();
// third();

//A-1 end ----------------------->

//A-2 start -------------------------->
//using return in function, a better practice

// const first = () => {
//   return "One";
// };

// const second = () => {
//   setTimeout(() => {
//     return "Two";
//   }, 3000);
// };

// const third = () => {
//   return "Three";
// };

// const callMe = () => {
//   let val1 = first();
//   console.log(val1);

//   let val2 = second();
//   console.log(val2);

//   let val3 = third();
//   console.log(val3);
// };

// callMe();

//A-2 end ---------------------------->

//A-3 start -------------------------->
//using async to get a promise

// const first = () => {
//   return "One";
// };

// const second = async () => {
//   setTimeout(() => {
//     return "Two";
//   }, 3000);
// };

// const third = () => {
//   return "Three";
// };

// const callMe = () => {
//   let val1 = first();
//   console.log(val1);

//   let val2 = second();
//   console.log(val2);

//   let val3 = third();
//   console.log(val3);
// };

// callMe();

//A-3 end ---------------------------->

//A-4 start -------------------------->
//final resolved code

const first = () => {
  return "One";
};

const second = () => {
  return new Promise((res, err) => {
    setTimeout(() => {
      res("Two");
    }, 3000);
  });
};

const third = () => {
  return "Three";
};

const callMe = async () => {
  let val1 = first();
  console.log(val1);

  let val2 = await second();
  console.log(val2);

  let val3 = third();
  console.log(val3);
};

callMe();

//A-4 end ---------------------------->
