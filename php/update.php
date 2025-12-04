<? 
// Update
include "db.php";
//use the get.php file to get the data from the database
$id = $_GET['id'];
$done = $_GET['done'];
//use SQL UPDATE query to update the task in the database
    //need to know what table (category) to update based on data 
$stmt = $conn->prepare("UPDATE todos SET is_done=1 WHERE id=?");
//bind parameters and execute the query
$stmt->bind_param("ii", $done, $id);
if($stmt -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
?>  