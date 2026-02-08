const image = document.querySelector('img')
const button = document.querySelector('button')

// button.addEventListener('click', () => {
//   fetch('https://dog.ceo/api/breeds/image/random')
//   .then(response => response.json())
//   .then(json => {
//     image.src = json.message
//   })
// })
button.addEventListener('click', () => {
  const xhr= new XMLHttpRequest
  xhr.responseType='json'
//   xhr.addEventListener('load',()=>{
//     image.src=xhr.response.message
//   console.log(xhr.response);
//   console.log(xhr);
xhr.onload=()=>{
    image.src=xhr.response.message
 console.log(xhr.response);
}
  
  xhr.open('GET',"https://dog.ceo/api/breeds/image/random")
  xhr.send()
})
setTimeout(()=>{
console.log(hi);
},4000)