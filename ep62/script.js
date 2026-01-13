const inputUsername=document.querySelector('#username')
const paragraph=document.querySelector('p')
// inputUsername.addEventListener('click', ()=>{
//     console.log('input clicked');
// })
// inputUsername.addEventListener('dblclick', ()=>{
//     console.log(' double input clicked');
// })
let inputValue
inputUsername.addEventListener('input', (e)=>{
    console.log(e.target.value);
    inputValue=e.target.value

    paragraph.innerText=e.target.value
    console.log(' double input clicked');
})