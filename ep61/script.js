const hi=document.querySelector("h1")
// hi.onclick= sayHi
hi.addEventListener('click',sayHi)
hi.addEventListener('click',function(){
    console.log("sayhiiii");
})

function sayHi(){
    console.log("HI")

}
const helloCard=document.querySelector('.card')
helloCard.addEventListener('click',hello)

 function hello(){
      console.log("hi there");
 }