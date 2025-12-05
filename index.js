
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById("taskForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const category = document.getElementById("taskCategorySelect").value;
    const due_date = document.getElementById("due_date").value;

    const data = new FormData();
    data.append("name", name);
    data.append("category", category);
    data.append("due_date", due_date);

    const response = await fetch("php/add.php", {
        method: 'POST',
        body: data
    });

    const result = await response.json();

    if (result.success) {
        loadTasks();            // Reload tasks from DB
        document.getElementById("taskForm").reset();  // Clear form
    } else {
        alert("Error adding task: " + result.error);
    }
    });
});
    
function loadTasks() {
    fetch("php/get.php")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("task-list");
            container.innerHTML = "";

            let selectedCategory = document.getElementById("taskCategorySelect")?.value || "";

            data.forEach(task => {

                if(selectedCategory && task.category !== selectedCategory) {
                    return;
                }

                container.innerHTML += `
                <p> 
                    <strong>${task.name}</strong><br>
                    Category: ${task.category}<br>
                    Due: ${task.due_date}<br>
                    Status: ${task.is_done == 1 ? "✔ Done" : "⏳ Pending"}<br>

                    <button onclick="toggleTask(${task.id}, ${task.is_done})">Toggle Status</button>
                    <button onclick="deleteTask(${task.id})" style="color:white;">Delete</button>

                </p>
                <hr>
                `;
            });
        })
        .catch(err => console.error("Error loading tasks:", err));
}

function toggleTask(id, is_done) {
    const data = new FormData();
    data.append("id", id);
    data.append("is_done", is_done == 1 ? 0 : 1);

    fetch(`php/update_done.php`, {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(result => {
            if(result.success) {
                loadTasks();
            }
        });
}

function deleteTask(id) {
    const data = new FormData();
    data.append("id", id);

    fetch(`php/delete.php`, {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(result => {
            if(result.success) {
                loadTasks();
            }
        });
}

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

  
let calendarDate = new Date();

let API_HOLIDAYS = [];

let TASKS = [];


async function fetchTasksForCalendar() {
    try {
        const res = await fetch("php/get.php");
        TASKS = await res.json();
    } catch (err) {
        console.error("Error loading tasks for calendar:", err);
    }
}

async function loadHolidayAPI(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
        API_HOLIDAYS = await res.json();
    } catch (err) {
        console.error("Holiday API error:", err);
        API_HOLIDAYS = []; // fallback
    }
}

async function loadCalendar() {

    console.log("Loading calendar…");
    let TASKS = [];
    try {
        const res = await fetch("php/get.php");
        TASKS = await res.json();
    } catch (err) {
        console.error("Task load error:", err);
    }

    const year = calendarDate.getFullYear();
    await loadHolidayAPI(year);

    const month = calendarDate.getMonth();
    const today = new Date();

    let monthYearEl = document.getElementById("month-year");

    if (monthYearEl) {
        monthYearEl.textContent = calendarDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });
    }

    let grid = document.getElementById("calendar-grid");

    if (!grid) {
        console.warn("calendar-grid NOT found in HTML → creating it automatically.");

        grid = document.createElement("div");
        grid.id = "calendar-grid";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(7, 1fr)";
        grid.style.gap = "10px";

        const section = document.getElementById("calendar-section");
        if (section) section.appendChild(grid);
    }

    grid.innerHTML = ""; 
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.classList.add("day");

        const label = document.createElement("span");
        label.textContent = day;
        cell.appendChild(label);

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const holidayObj = API_HOLIDAYS.find(h => h.date === dateKey);

        if (holidayObj) {
            cell.classList.add("holiday");

            const holidayLabel = document.createElement("span");
            holidayLabel.classList.add("holiday-name");
            holidayLabel.textContent = holidayObj.localName;
            cell.appendChild(holidayLabel);
        }

        const tasksToday = TASKS.filter(t => t.due_date === dateKey);

        if (tasksToday.length > 0) {
            const list = document.createElement("div");
            list.classList.add("task-list");

            tasksToday.forEach(task => {
                const tag = document.createElement("div");
                tag.classList.add("task-tag");
                tag.textContent = task.name;
                list.appendChild(tag);
            });

            cell.appendChild(list);
        }

        cell.addEventListener("click", () => {
            let msg = `📅 ${dateKey}\n\n`;

            if (holidayObj) msg += `🎉 Holiday: ${holidayObj.localName}\n\n`;

            if (tasksToday.length > 0) {
                msg += "📝 Tasks:\n" +
                       tasksToday.map(t => "- " + t.name + " (" + t.category + ")").join("\n");
            } else if (!holidayObj) {
                msg += "No events.";
            }

            alert(msg);
        });

        grid.appendChild(cell);
    }

    console.log("Calendar loaded.");
}

document.querySelector('[data-section="calendar-section"]')
    .addEventListener("click", async () => {
        await loadHolidayAPI(calendarDate.getFullYear());
        loadCalendar();
    });

document.getElementById("prev-month").addEventListener("click", async () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    await loadHolidayAPI(calendarDate.getFullYear());
    loadCalendar();
});

document.getElementById("next-month").addEventListener("click", async () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    await loadHolidayAPI(calendarDate.getFullYear());
    loadCalendar();
});
