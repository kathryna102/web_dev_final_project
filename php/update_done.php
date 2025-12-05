<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

$id = $_POST['id'];
$is_done = $_POST['is_done'];

// Validate fields
if ($id === null || $is_done === null) {
    echo json_encode(["success" => false, "error" => "Missing id or is_done"]);
    exit;
}

// Prepare and execute SQL UPDATE
$stmt = $conn->prepare("UPDATE todos SET is_done = ? WHERE id = ?");
$stmt->bind_param("ii", $is_done, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>