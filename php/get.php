<?php 
// establishses the database connection
include "../db.php";
// get data from database
// write a query to get all tasks
$result = $conn->query("SELECT * FROM todos");

$tasks = [];
//if($result) {
while($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}
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