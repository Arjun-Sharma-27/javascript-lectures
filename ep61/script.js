const hi = document.querySelector("h1");
const container = document.querySelector(".container");
const addCard = document.querySelector(".add-card");

// click on h1
hi.addEventListener("click", sayHi);
hi.addEventListener("click", function () {
    console.log("sayhiiii");
});

function sayHi() {
    console.log("HI");
}
let count=1

// click on + card to add new card
addCard.addEventListener("click", () => {
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.textContent = count;
    count++;
    container.append(newCard);
});
