const inputUsername=document.querySelector('#username')
// inputUsername.addEventListener('click', ()=>{
//     console.log('input clicked');
// })
// inputUsername.addEventListener('dblclick', ()=>{
//     console.log(' double input clicked');
// })
inputUsername.addEventListener('input', (e)=>{
    console.log(e);
    console.log(' double input clicked');
})