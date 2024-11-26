document.addEventListener('DOMContentLoaded', () => {
const tableBody = document.getElementById("table-body");
const form = document.getElementById("dog-form");
let editingDogId = null;

function fetchDogs(){
    fetch("http://localhost:3000/dogs")
    .then((response) => response.json())
    .then((dogs) => renderDogs(dogs));
}

function renderDogs(dogs){
    tableBody.innerHTML = "";
    dogs.forEach((dog) => {
        const row = document.createElement("tr");
        row.innerHTML = 
        `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
      `;
      tableBody.appendChild(row);

    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", handleEditClick);

    });
}


function handleEditClick(event){
    const dogId = event.target.dataset.id;

    fetch(`http://localhost:3000/dogs/${dogId}`)
    .then((response) => response.json())
    .then((dog) => {
        form.name.value = dog.name;
        form.breed.value = dog.breed;
        form.sex.value = dog.sex;
        

        editingDogId = dog.id;
    });
}



form.addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedDog = {
        name: form.name.value,
        breed: form.breed.value,
        sex: form.sex.value,
    };
    fetch(`http://localhost:3000/dogs/${editingDogId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(updatedDog),
    })
    .then((response) => response.json())
    .then(() => {
        fetchDogs();

        form.reset();
        editingDogId = null;
    });
});

fetchDogs();

});

