const image = document.querySelector('img')
const button = document.querySelector('button')


button.addEventListener('click', () => {
  const xhr= new XMLHttpRequest
  xhr.responseType='json'
  xhr.addEventListener('load',()=>{
    image.src=xhr.response.message
  console.log(xhr.response);
  console.log(xhr);

  
  xhr.open('GET',"https://dog.ceo/api/breeds/image/random")
  xhr.send()
})
})
// setTimeout(()=>{
// console.log('hi');
// },4000)
// const blockinbutton= document.querySelector(".blockin-btn")
// blockinbutton.addEventListener('click',()=>{
// const startTime= Date.now()
// let currentTime= startTime
// while(startTime+4000> currentTime){
//   currentTime=Date.now()
// }
// })
