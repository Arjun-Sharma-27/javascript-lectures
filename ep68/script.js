const my_Name = document.querySelector('.name-tag')
const inputField = document.querySelector('.input-field')
const ageField = document.querySelector('.age-field')
const my_Age = document.querySelector('.age-tag')


// my_Name.innerText=localStorage.getItem('myName') 

// inputField.addEventListener("input",(e)=>{ 
//     localStorage.setItem('myName',e.target.value)
//     my_Name.innerText=localStorage.myName
// })
// my_Age.innerText=localStorage.getItem('myAge') 

// ageField.addEventListener("input",(e)=>{
//     localStorage.setItem('myAge',e.target.value)
//     my_Age.innerText=localStorage.myAge
// })
const myData = JSON.parse(localStorage.getItem("myData")) ||{}

if(myData.i_name){
    my_Name.innerText=myData.i_name

}
if(myData.age){
   my_Age.innerText=myData.age

}
inputField.addEventListener("input",(e)=>{ 
    myData.i_name=e.target.value
    localStorage.setItem("myData",JSON.stringify(myData))
    my_Name.innerText=e.target.value
})

ageField.addEventListener("input",(e)=>{ 
    myData.age=e.target.value
    localStorage.setItem("myData",JSON.stringify(myData))
    my_Age.innerText=e.target.value
})
