<?php 
// Create
//establishes the database connection
include "../db.php";

//prepare data for insertion by using SELECT and select all rows
$name = $_POST['name'];
$category = $_POST['category'];
$due_date = $_POST['due_date'];
// use SQL INSERT query to insert the new task into the database
// - tasks will have a name (string), category (string), due date (YYYY-MM-DD)
$stmt = $conn->prepare("INSERT INTO todos (name, category, due_date) VALUES (?, ?, ?)");
$stmt -> bind_param("sss", $name, $category, $due_date);
$stmt -> execute();

echo "OK";

?>