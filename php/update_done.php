<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

include "db.php";

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
    exit;
}

$id = $_POST['id'];
$is_done = $_POST['is_done'];

// Validate fields
if ($id === null || $is_done === null) {
    echo json_encode(["success" => false, "error" => "Missing id or is_done"]);
    exit;
}

$is_done = intval($is_done); // ensure it's 0 or 1
$id = intval($id);

// Prepare and execute SQL UPDATE
$stmt = $conn->prepare("UPDATE tasks SET is_done = ? WHERE id = ?");
$stmt->bind_param("ii", $is_done, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>