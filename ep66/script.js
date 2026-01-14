const addCardBtn = document.querySelector('.card')
const container = document.querySelector('.container')
const input=document.querySelector('input')
const form=document.querySelector('form')

let count = 1

addCardBtn.addEventListener('click', () => {
    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.innerText = count++
    container.append(newCard)
})
// const intervalId=setInterval(()=>{
//     if(count<999){
//     clearInterval()
//     }
//    addCardBtn.click()},20)
// setTimeout(()=>{
//     input.focus()},1000)

// setTimeout(()=>{
//     input.blur()},2000)

// setTimeout(()=>{
//     form.submit()
// console.log("form subited");},2000)