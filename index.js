document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("new-task");
    const addButton = document.getElementById("add-task");

    //Load existing items from backend (get.php not written yet)
    fetch("php/get.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                addTaskToDOM(task);
            });
        });

    function addTaskToDOM($task) {
        //TODO: write this function to display the task to the sDOM
        apiData.innerHTML = <li>{$task}</li>
    }
});



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
