document.addEventListener("DOMContentLoaded", function () {
    const doggoUrl = "http://localhost:3000/pups";
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const goodDogFilterBtn = document.getElementById("good-dog-filter");

    let showOnlyGoodDogs = false;

    function fetchDogs() {
        fetch(doggoUrl)
        .then(response => response.json())
        .then(data => {
            displayDogs(data);
        })
        .catch((error) => console.error("no doggos", error));
    }

    function displayDogs(dogs) {
        dogBar.innerHTML = ""; 
        dogs.forEach(dog => {
            if (!showOnlyGoodDogs || (showOnlyGoodDogs && dog.isGoodDog)) {
                const dogSpan = document.createElement("span");
                dogSpan.textContent = dog.name;
                dogSpan.addEventListener('click', () => showDogInfo(dog));
                dogBar.appendChild(dogSpan);
            }
        });
    }

    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>`;

        const goodDogBadDogStatus = document.createElement("button");

        goodDogBadDogStatus.textContent = dog.isGoodDog ? "Good Dog" : "Bad Dog";

        goodDogBadDogStatus.addEventListener("click", () => toggleDogStatus(dog, goodDogBadDogStatus));

        dogInfo.appendChild(goodDogBadDogStatus);
    }

    goodDogFilterBtn.addEventListener("click", () => {
        showOnlyGoodDogs = !showOnlyGoodDogs;
        goodDogFilterBtn.textContent = showOnlyGoodDogs ? "Filter good dogs: ON" : "Filter good dogs: OFF";
        fetchDogs();
    });

    function toggleDogStatus(dog, button) {
        const updatedStatus = !dog.isGoodDog;

        fetch(`${doggoUrl}/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ isGoodDog: updatedStatus }),
        })
        .then(response => response.json())
        .then(updatedDog => {
            dog.isGoodDog = updatedDog.isGoodDog;
            button.textContent = updatedDog.isGoodDog ? "Good Dog" : "Bad Dog";
            fetchDogs(); 
        })
        .catch((error) => console.error("server PATCH failed", error));
    }

    fetchDogs();
});