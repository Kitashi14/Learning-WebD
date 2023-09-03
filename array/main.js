arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(arr);

//Map
//doubling elements

const double = (element) => {
  return element * 2;
};

console.log(arr.map(double));

//Filter (returns elements who returned true)
//odd elements

const issOdd = (element) => {
  return element % 2;
};

console.log(arr.filter(issOdd));

//Reduce (iterating to all elements)
//sum of all elements

const sumOfAllElements = (acc, curr) => {
  //there are 2 arguements in reduce callback
  //acc is accumulator while curr is current
  //acc is variable used to store the value by being stored/modified at each index
  //curr is the current element of the arr
  acc = acc + curr;
  return acc;
};

console.log(arr.reduce(sumOfAllElements, 0));

//max of arr

const maxOfArray = (acc, curr) => {
  if (acc < curr) {
    acc = curr;
  }
  return acc;
};

console.log(arr.reduce(maxOfArray, -1));

//Real Data example
const users = [
  { firstName: "Manish", lastName: "Upadhayay", age: 23 },
  { firstName: "Nilesh", lastName: "Ranjan", age: 25 },
  { firstName: "Aryan", lastName: "Kumar", age: 33 },
  { firstName: "Ayush", lastName: "Kumar", age: 23 },
];
console.log(users);

//Name
console.log(
  users.map((element) => {
    return element.firstName + " " + element.lastName;
  })
);

//O-1 start -------------------->
//creating key value pair using square bracket

// let obj = {}

// console.log(obj);
// if(obj[34]){

// }
// else{
//     obj[34] = 12;
// }
// console.log(obj);

//O-1 end ------------------------>

//making diff age key value pair
console.log(
  users.reduce((acc, curr) => {
    if (acc[curr.age]) {
      acc[curr.age] = acc[curr.age] + 1;
    } else {
      acc[curr.age] = 1;
    }
    return acc;
  }, {})
);

//first name of people age greater than 24

console.log(
  users.filter((elem) => elem.age > 24).map((elem) => elem.firstName)
);
