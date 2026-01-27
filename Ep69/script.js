const image=document.querySelector('img')

 fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(json =>{
        console.log("got this");
         console.log(json.message)
         image.src=json.message
      
      })