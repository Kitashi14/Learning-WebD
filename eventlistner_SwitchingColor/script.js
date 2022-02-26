const outerBox = document.querySelector(".outerBox");
const middleBox = document.querySelector(".middleBox");
const innerBox = document.querySelector(".innerBox");
const body = document.querySelector("body");

//getcomputedstyle is used for extracting the css of an element (present in different file)
const middleBoxBg = getComputedStyle(middleBox).backgroundImage;
console.log("color of middle box is : " + middleBoxBg);

//method addEventListner take 2 parameter ( type of event , callback func)

//T-1 --------------------start

outerBox.addEventListener("click", (e) => {
  console.log(e.target);  // "target" mostly used property
  const bodyBg = getComputedStyle(body).backgroundImage;
  const target_color = getComputedStyle(e.target).backgroundImage;
  const temp = target_color;
  e.target.style.backgroundImage = bodyBg;
  body.style.backgroundImage = temp;
  e.stopPropagation();  //stoping further bubble or capture propagation

});

middleBox.addEventListener("click", (e) => {
  e.stopPropagation();
  const bodyBg = getComputedStyle(body).backgroundImage;
  const target_color = getComputedStyle(e.target).backgroundImage;
  const temp = target_color;
  e.target.style.backgroundImage = bodyBg;
  body.style.backgroundImage = temp;
  console.log(e.target);
});

innerBox.addEventListener("click", (e) => {
  console.log(e.target);
  const bodyBg = getComputedStyle(body).backgroundImage;
  const target_color = getComputedStyle(e.target).backgroundImage;
  const temp = target_color;
  e.target.style.backgroundImage = bodyBg;
  body.style.backgroundImage = temp;
  e.stopPropagation();
});

//T-1 -----------------------end

//Event bubbling example

//T-2 -------------------------start

// outerBox.addEventListener("click", (e) => {
//   console.log("Outerbox (grandparent) clicked");
// });

// middleBox.addEventListener("click", (e) => {
//   console.log("Middlebox (parent) clicked");
// });

// innerBox.addEventListener("click", (e) => {
//   console.log("Innerbox (child) clicked");
// });

//T-2 -------------------------end

//Event capturing example

//T-3 -------------------------start

// outerBox.addEventListener("click", (e) => {
//   console.log("Outerbox (grandparent) clicked");
// }, true);

// middleBox.addEventListener("click", (e) => {
//   console.log("Middlebox (parent) clicked");
// }, true);

// innerBox.addEventListener("click", (e) => {
//   console.log("Innerbox (child) clicked");
// }, true);

//T-3 -------------------------end

//Event capturing example (not all set to capture)

//T-4 -------------------------start

// outerBox.addEventListener("click", (e) => {
//   console.log("Outerbox (grandparent) clicked");
// }, );

// middleBox.addEventListener("click", (e) => {
//   console.log("Middlebox (parent) clicked");
// }, true);

// innerBox.addEventListener("click", (e) => {
//   console.log("Innerbox (child) clicked");
// }, true);

//T-4 -------------------------end

//another way of adding event listener to each element

// const divs = document.querySelectorAll("div");
// divs.forEach(div => {
//     div.addEventListener()
// })

// DomObject.removeEventListener(type of func, name of callback function)

//bubbling and capturing phase in event

// try this out (it should print about the dom element u clicked on)

// document.addEventListener("click", e => {
//     console.log(e.target);
// });

//we can execute multiple addeventlistner
//they will be executed in the ordered one is defined in

// outerBox.addEventListener("click", e => {
//     console.log("2nd eventListner used");
// });
