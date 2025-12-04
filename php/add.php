<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
//establishes the database connection
include "db.php";

//prepare data for insertion by using SELECT and select all rows
$name = $_POST['name'];
if(isset($_POST['taskCategorySelect'])) {
    $category = $_POST['taskCategorySelect'];
} else {
    $category = 'No category selected';
}
$due_date = $_POST['due_date'];

if(!$name || !$category || !$due_date) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}
// use SQL INSERT query to insert the new task into the database
// - tasks will have a name (string), category (string), due date (YYYY-MM-DD)
$stmt = $conn->prepare("INSERT INTO todos (name, category, due_date, is_done) VALUES (?, ?, ?, 0)");
$stmt -> bind_param("sss", $name, $category, $due_date);
if($stmt -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();

?>