// const num1 = 45;
// const num2 = 545;
// console.log(num1);
// console.log(num2);

// //function to support callback
// const mul_callback = (operand1, operand2, callback) => {
//   if (typeof operand1 != "number" || typeof operand2 != "number") {
//     callback(null, Error("Enter valid operands."));
//     return Error("Enter valid Operands.");
//   } else {
//     const ans = operand1 * operand2;
//     callback(ans, null);
//     return ans;
//   }
// };

// //using the callback defined function
// mul_callback(num1, num2, (result, err) => {
//   console.log("using callback with error handling");
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("num1 : " + num1);
//     console.log("num2 : " + num2);
//     console.log("1 result is " + result + "\n\n");
//   }
// });

// console.log("using callback with fake one");
// console.log(mul_callback(num1, num2, () => {})); // had to add callback to match no. of parameters of main function

// //without handling error part
// mul_callback(num1, num2, (result) => {
//   //no need to match no. of parameters of a callback function
//   console.log("using callback without error handling");
//   console.log("num1 : " + num1);
//   console.log("num2 : " + num2);
//   console.log("1' result is " + result + "\n\n");
// });

// // console.log("got here 1");

// //function to support promise
// const mul_promise = async (operand1, operand2) => {
//   const ans = new Promise((resolve, reject) => {
//     if (typeof operand1 != "number" || typeof operand2 != "number") {
//       reject(Error("Enter valid operands."));
//     } else {
//       resolve(operand1 * operand2);
//     }
//   });
//   return ans;
// };

// //using the promise defined function with then()/catch() method
// mul_promise(num1, num2)
//   .then((result) => {
//     console.log("using promise with then/catch");
//     console.log("num1 : " + num1);
//     console.log("num2 : " + num2);
//     console.log("2 result is " + result + "\n\n");
//   })
//   .catch((err) => {
//     console.log("using promise with then/catch");
//     console.log(err);
//   });

// // console.log("got here 2");

// //using the promise defined function with async/await & try/catch
// const async_func = async () => {
//   try {
//     const result = await mul_promise(num1, num2);
//     console.log("using promise with async/await with try/catch");
//     console.log("num1 : " + num1);
//     console.log("num2 : " + num2);
//     console.log("3 result is " + result + "\n\n");
//   } catch (err) {
//     console.log("using promise with async/await with try/catch");
//     console.log(err);
//   }
// };
// async_func();

// // console.log("got here 3");

// //function to support both callback and promise
// mul_callback_promise = async (operand1, operand2, callback) => {
//   if (typeof operand1 != "number" || typeof operand2 != "number") {
//     callback(null, Error("Enter valid operands."));
//   } else {
//     const ans = operand1 * operand2;
//     callback(ans, null);
//   }
//   const ans = new Promise((resolve, reject) => {
//     if (typeof operand1 != "number" || typeof operand2 != "number") {
//       reject(Error("Enter valid operands."));
//     } else {
//       resolve(operand1 * operand2);
//     }
//   });
//   return ans;
// };

// //using the callback/promise function
// //using callback part
// mul_callback_promise(num1, num2, (result, err) => {
//   console.log(
//     "using callback of callback/promise with error handling with callback part"
//   );
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("num1 : " + num1);
//     console.log("num2 : " + num2);
//     console.log("4 result is " + result + "\n\n");
//   }
// }).catch((err) => {
//   //had to handle promise rejection error
//   console.log(
//     "using callback of callback/promise with error handling with promise part"
//   );
//   console.log(err);
// });

// // console.log("got here 4");
// //using promise part
// mul_callback_promise(num1, num2, () => {}) //had to add a callback function
//   .then((result) => {
//     console.log("using promise of callback/promise with error handling");
//     console.log("num1 : " + num1);
//     console.log("num2 : " + num2);
//     console.log("5 result is " + result + "\n\n");
//   })
//   .catch((err) => {
//     console.log("using promise of callback/promise with error handling");
//     console.log(err);
//   });

// console.log("got here 5");

// -------------------------------------------------------------------------------------------------------------

// callback to promise conversion and vise-versa

const num1 = 34;
const num2 = 45;

const callback_supporting_func = (operand1, operand2, callback) => {
  if (typeof operand1 != "number" || typeof operand2 != "number") {
    callback(null, Error("Enter valid operands."));
  } else {
    const ans = operand1 * operand2;
    callback(ans, null);
  }
};

const promise_supporting_func = async (operand1, operand2) => {
  const ans = await new Promise((resolve, reject) => {
    if (typeof operand1 != "number" || typeof operand2 != "number") {
      reject(Error("Enter valid operands."));
    } else {
      resolve(operand1 * operand2);
    }
  });

  return ans;
};

const callback_to_promise_func = async (operand1, operand2) => {
  const ans = await new Promise((resolve, reject) => {
    callback_supporting_func(operand1, operand2, (result, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return ans;
};

const promise_to_callback_func = (operand1, operand2, callback) => {
  promise_supporting_func(operand1, operand2)
    .then((result) => {
      callback(result, null);
    })
    .catch((err) => {
      callback(null, err);
    });
};

//using callback_supporting_func with callback
callback_supporting_func(num1, num2, (result, err) => {
  console.log("\nusing callback_supporting_func as callback");
  if (err) {
    console.log(err);
  } else {
    console.log("result : ", result);
  }
});

//using promise_supporting func with promise
promise_supporting_func(num1, num2)
  .then((result) => {
    console.log("\nusing promise_supporting func with promise");
    console.log("result : ", result);
  })
  .catch((err) => {
    console.log("\nusing promise_supporting func with promise");
    console.log(err);
  });

//using callback_to_promise_func
callback_to_promise_func(num1, num2)
  .then((result) => {
    console.log("\nusing callback_to_promise_func");
    console.log("result : ", result);
  })
  .catch((err) => {
    console.log("\nusing pcallback_to_promise_func");
    console.log(err);
  });

// using promise_to_callback_func
promise_to_callback_func(num1, num2, (result, err) => {
  console.log("\nusing promise_to_callback_func");
  if (err) {
    console.log(err);
  } else {
    console.log("result : ", result);
  }
});
