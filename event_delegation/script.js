const category = document.querySelector("#category");

category.addEventListener("click", (e)=>{
    if(e.target.id != "category"){
        window.location.href = "/" + e.target.id;
    }
});

//here instead of writing events for multiple items we write for a single common parent element and use the concept of evneny delegation.