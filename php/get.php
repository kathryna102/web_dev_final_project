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
/*} else {
    http_response_code(500);
    echo json_encode(['error' => $conn->error]);
}
*/
// execute the query
// fetch the results
// close the connection

?>