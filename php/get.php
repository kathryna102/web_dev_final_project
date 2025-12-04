<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
// establishses the database connection
include "db.php";
// get data from database
// write a query to get all tasks
$result = $conn->query("SELECT * FROM todos ORDER BY due_date ASC");

$tasks = [];
//if($result) {
while($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

header('Content-Type: application/json');
echo json_encode($tasks);

// execute the query
// fetch the results

?>