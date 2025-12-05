<?php
// Delete
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";
//use the get.php file to get the data from the database
//use SQL DELETE query to delete the task in the database
//execute the query
//close the connection
//use prepared statements
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "error" => "Invalid request method"
    ]);
    exit;
}

$id = $_POST['id'] ?? null;

if ($id === null) {
    echo json_encode([
        "success" => false,
        "error" => "Missing task ID"
    ]);
    exit;
}

//$id = intval($id);

$stmt = $conn->prepare("DELETE FROM todos WHERE id=?");
$stmt->bind_param("i", $id);

if($stmt -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>