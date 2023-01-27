const category = document.querySelector("#category");

// T-1 ------------start

// category.addEventListener("click", (e) => {
//   console.log(e.target);
//   if (e.target.id != "category") {
//     window.location.href = "/" + e.target.id;
//   }
// });

//T-1 ----------------end

// T-2 ------------start

category.addEventListener("click", (e) => {
    console.log(e);
  console.log(e.target.tagName);
  if (e.target.tagName == "LI") {
    window.location.href = "/" + e.target.id;
  }
});
//T-2 ----------------end

//here instead of writing events for multiple items we write for a single common parent element and use the concept of event delegation.
