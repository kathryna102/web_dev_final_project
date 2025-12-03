
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
