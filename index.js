
document.addEventListener('DOMContentLoaded', loadTasks); /*() => {
    
    const input = document.getElementById("new-task");
    const addButton = document.getElementById("add-task");

    //Load existing items from backend
    fetch("./php/get.php")
        .then(response => {
        if (!response.ok) throw new Error('Network response was not OK');
        return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Unexpected response:', data);
                return;
            }
            data.forEach(task => addTaskToDOM(input));
        })
        .catch(err => {
            console.error('Failed to load tasks:', err);
    });
});
*/

function loadTasks() {
    fetch("php/get.php")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("task-list");
            container.innerHTML = "";

            data.forEach(task => {
                container.innerHTML += `
                <p> 
                    <strong>${task.name}</strong><br>
                    Category: ${task.category}<br>
                    Due: ${task.due_date}<br>
                    Status: ${task.is_done == 1 ? "✔ Done" : "⏳ Pending"}<br>

                    <button onclick="toggleTask(${task.id}, ${task.is_done})">Toggle Status</button>
                    <button onclick="deleteTask(${task.id})" style="color:red;">Delete</button>

                </p>
                <hr>
                `;
            });
        });
}

document.getElementById("taskForm").addEventListener("add-task", function(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", document.getElementById("name").value);
    data.append("category", document.getElementById("category").value);
    data.append("due_date", document.getElementById("due_date").value);

    fetch("php/add.php", {
        method: 'POST',
        body: data
    }).then(() => {
        loadTasks();
        document.getElementById("taskForm").reset();
    });
});


function toggleTask(id, current) {
    fetch(`api/update.php?id=${id}&done=${current == 1 ? 0 : 1}`)
        .then(() => loadTasks());
}

function deleteTask(id) {
    fetch(`api/delete.php?id=${id}`)
        .then(() => loadTasks());
}

/*function addTaskToDOM($task) {
        //TODO: write this function to display the task to the DOM
        const list = document.getElementById('task-list');
        if(!list) return;

        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        const text = document.createElement('span');
        text.className = 'task-text';
        const due = task.due_date ? ` — Due: ${task.due_date}` : '';
        text.textContent = `${task.name}${due}`;
       
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        // add edit handler later

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        // add delete handler later

        li.appendChild(text);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }
*/

function getWeather() {

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.676998&longitude=-111.042931&current_weather=true&temperature_unit=fahrenheit';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const weather = data;

        document.getElementById('temp').textContent = `Temperature: ${weather.current_weather.temperature}${weather.current_weather_units.temperature}`;
        document.getElementById('wind').textContent = `Wind Speed: ${weather.current_weather.windspeed} ${weather.current_weather_units.windspeed}`;
        document.getElementById('elevation').textContent = `Elevation: ${weather.elevation} feet`;

    })
    .catch(error => console.error("Error fetching weather:", error));
}

getWeather();

const API_KEY = "6WJaz5oTGreibbiVzHUZbWh753LiEuB2sJ1ZUd7a";

const NUTRIENT_IDS = {
    calories: 1008,
    totalFat: 1004,
    saturatedFat: 1258,
    cholesterol: 1253,
    sodium: 1093,
    totalCarbs: 1005,
    fiber: 1079,
    sugars: 2000,
    protein: 1003
};

document.getElementById("search-nutrition").addEventListener("click", async () => {
    const input = document.getElementById("nutrition-input").value.trim();
    if (!input) {
        alert("Enter a whole food name.");
        return;
    }
    await searchFood(input);
});

async function searchFood(query) {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=3&api_key=${API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.foods || data.foods.length === 0) {
            document.getElementById("nutrition-results").innerHTML = "<p>No whole-food results found.</p>";
            return;
        }

        displayTopThree(data.foods);

        const firstFood = data.foods[0];
        fillNutritionLabel(firstFood);

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function displayTopThree(foods) {
    let html = "<p><strong>Top 3 Results:</strong></p><ol>";
    foods.forEach(food => {
        html += `<li>${food.description}</li>`;
    });
    html += "</ol>";
    document.getElementById("nutrition-results").innerHTML = html;
}

function extractNutrients(foodNutrients) {
    const results = {};

    for (const [key, id] of Object.entries(NUTRIENT_IDS)) {
        const found = foodNutrients.find(n => n.nutrientId === id);
        results[key] = found ? found.value : "—";
    }
    return results;
}

function fillNutritionLabel(food) {
    const nutrients = extractNutrients(food.foodNutrients);

    document.getElementById("food-name").textContent = food.description;
    document.getElementById("calories").textContent = nutrients.calories;
    document.getElementById("totalFat").textContent = nutrients.totalFat + " g";
    document.getElementById("saturatedFat").textContent = nutrients.saturatedFat + " g";
    document.getElementById("cholesterol").textContent = nutrients.cholesterol + " mg";
    document.getElementById("sodium").textContent = nutrients.sodium + " mg";
    document.getElementById("totalCarbs").textContent = nutrients.totalCarbs + " g";
    document.getElementById("fiber").textContent = nutrients.fiber + " g";
    document.getElementById("sugars").textContent = nutrients.sugars + " g";
    document.getElementById("protein").textContent = nutrients.protein + " g";

    document.getElementById("nutrition-label").classList.remove("hidden");
}

document.getElementById("getQuotesBtn").addEventListener("click", getQuotes);

async function getQuotes() {
    const category = document.getElementById("categorySelect").value;
    if (!category) {
      alert("Please choose a category!");
      return;
    }

    const url = `https://quoteslate.vercel.app/api/quotes/random?tags=${encodeURIComponent(category)}&count=5`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const container = document.getElementById("quotesContainer");
      container.innerHTML = "";

      data.forEach(q => {
        const card = document.createElement("div");
        card.className = "quote-card";
        card.innerHTML = `
          <p class="quote-text">"${q.quote}"</p>
          <p class="quote-author">— ${q.author}</p>
        `;
        container.appendChild(card);
      });

    } catch (err) {
      console.error("Error fetching quotes:", err);
      document.getElementById("quotesContainer").innerText = "Could not load quotes. Try again.";
    }
  }

  document.getElementById("getQuotesBtn").addEventListener("click", getQuotes);