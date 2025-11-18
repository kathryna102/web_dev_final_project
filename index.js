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
