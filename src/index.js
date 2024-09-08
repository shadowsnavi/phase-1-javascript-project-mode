// Built off pre-existing code
//can't run code normally on Google chrome have to use Live Server
console.log("Hello")

document.addEventListener('DOMContentLoaded', main)

const catMenu = document.getElementById('cat-menu')
const detailImage = document.querySelector('.detail-image')
const name = document.querySelector('.name')
const age = document.querySelector('.age')
const gender = document.getElementById('gender-display')
const breed = document.getElementById('breed-display')


// requesting data from server and displaying cat 
function displaycats() {
  return fetch ('db.json')
  .then(function(response) {
    return response.json()
  })
  .then(data => {
console.log(data)
        data.cats.forEach((cat, index) => {
        const img = document.createElement('img')
        img.src = cat.image
        img.alt = cat.name
        img.addEventListener('click', () => handleClick(cat)) 
        catMenu.appendChild(img) 

        if(index === 0) {  
          handleClick(cat) 
      }
      else{
            console.log("Kitty display issue")
      }
    })
  })
}

// Linking HTML locational insert to cat data to handleClick event 

  // function handleClick(cat) {
    // detailImage.src = cat.image
    // name.textContent = cat.name 
    // age.textContent = cat.age
    // gender.textContent = cat.gender 
    // breed.textContent = cat.breed
  // }

// Targeting & submitting form element values for new-cat
//   function submitListener() {
//     const form = document.querySelector('form')
//     form.addEventListener('submit', (e) => {
//       if (e.preventDefault()){
//       console.log("Haven has sniffed this")
//       }
//       const newcat = {
//         name: e.target.name.value,
//         age: e.target.age.value,
//         image: e.target.image.value,
//         gender: e.target.gender.value,
//         breed: e.target["new-breed"].value, 
//       }
//       addImage(newcat) 
//     })
//   }
  
// // creation on new input 
//     function addImage(newcat) {
//       const img = document.createElement('img')
//         img.src = newImage.image 
//         img.alt = newImage.name
//         img.addEventListener('click', () => handleClick(newcat))
//         catMenu.appendChild(img)  
//     };
  
    // Display of current raman and render of added
    function main() {
      displaycats();
    //  submitListener();
    }
    
    export {
      main,
      displaycats,
     // handleClick,
      //submitListener,
      //addImage,
    }