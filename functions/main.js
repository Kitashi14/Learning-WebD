// A-1 start --------------------->

// const main = (cb = (elem)=>{

//   return elem +10;
// }) =>{

//   console.log(cb(45));
// }

// main();

// A-1 end ---------------->

// A-2 start --------------------->

// const callback = (elem) => {
//   return elem + 10;
// };

// const main = (cb) => {
//   console.log(cb(45));
// };

// main(callback);

// A-2 end ---------------->

//B-1 start ----------------->

// const radius = [3, 45, 2, 25];

// const calculateArea = (radius) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(Math.PI * radius[i] * radius[i]);
//   }
//   return output;
// };

// console.log(calculateArea(radius));

// const calculateCircumference = (radius) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(2*Math.PI * radius[i]);
//   }
//   return output;
// };

// console.log(calculateCircumference(radius));

// const calculateDiameter = (radius) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(2*radius[i]);
//   }
//   return output;
// };

// console.log(calculateDiameter(radius));

//B-1 end -------------------->

//B-2 start ----------------------->

// const radius = [3, 45, 2, 25];

// const area = (radius) => {
//   return Math.PI * radius * radius;
// };

// const cicumference = (radius) =>{
//   return 2*Math.PI*radius;
// }

// const diameter = (radius)=>{
//   return 2*radius;
// }

// const calculate = (radius, logic) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(logic(radius[i]));
//   }
//   return output;
// };

// console.log(calculate(radius,area));
// console.log(calculate(radius, cicumference));
// console.log(calculate(radius,diameter));

//B-2 end ---------------------------->

//B-3 start -------------------------->

// const radius = [3, 45, 2, 25];
// console.log(radius);

// const calculate = (
//   radius,
//   logic = (r) => {
//     return Math.PI * r * r;
//   }
// ) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(logic(radius[i]));
//   }
//   return output;
// };

// console.log(calculate(radius));

//B-3 end----------------------->

//B-4 start ----------------------->

// const radius = [3, 45, 2, 25];

// area = (r) => {
//   return Math.PI * r * r;
// };

// const calculate = (radius, logic) => {
//   const output = [];
//   for (let i = 0; i < radius.length; i++) {
//     output.push(logic(radius[i]));
//   }
//   return output;
// };

// console.log(calculate(radius, area));
// console.log(radius.map(area));

//B-4 end ------------------------->

//B-5 start --------------------->

// const radius = [3, 45, 2, 25];

// area = (r) => {
//   return Math.PI * r * r;
// };

// Array.prototype.calculate = function (logic){
//   //arrow function doesn't work here 
//   const output = [];
//   for (let i = 0; i < this.length; i++) {
//     output.push(logic(this[i]));
//   }
//   return output;
// };

// console.log(radius.calculate(area));
// console.log(radius.map(area));

//B-5 end -------------------->

