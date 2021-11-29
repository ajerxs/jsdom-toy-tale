let addToy = false;

const toysUrl = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
  submitToy();
});

function fetchToys() {
  return fetch(toysUrl)
  .then(res => res.json())
  .then(toyData => renderToyCards(toyData))
}

function renderToyCards(toys) {
  let toyCollection = document.querySelector('#toy-collection')
  toyCollection.innerHTML = ""
  toys.forEach(e => {
    const card = document.createElement('div')
    card.classList.add("card")
    
    const h2 = document.createElement('h2')
    h2.innerText = e.name

    const img = document.createElement('img')
    img.classList.add("toy-avatar")
    img.src = e.image

    const p = document.createElement('p')
    p.id = `toyLikes-${e.id}`
    p.innerText = e.likes + ' Likes'

    const button = document.createElement('button')
    button.classList.add("like-btn")
    button.innerText = "Like"

    button.addEventListener('click', () => {
      likeToy(e)
    })

    card.append(h2, img, p, button)

    toyCollection.appendChild(card)
  })
}

function submitToy() {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const newToy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }

    const configObj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newToy)
    }

    fetch(toysUrl, configObj)
    .then(res => res.json())
    .then(fetchToys())
    form.reset();
  })
}

function likeToy(toy) {
  let likes = parseInt(document.getElementById(`toyLikes-${toy.id}`).innerText.split(" ")[0])

  let newLikes = {
    likes: likes + 1
  }

  const configObj = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newLikes)
  }

  fetch(toysUrl+`/${toy.id}`, configObj)
  .then(res => res.json())
  .then((toyObj) => {
    document.getElementById(`toyLikes-${toy.id}`).innerText = newLikes.likes + " Likes"
  })
}