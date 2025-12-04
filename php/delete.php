<? 
// Delete
include "db.php";
//use the get.php file to get the data from the database
//use SQL DELETE query to delete the task in the database
//execute the query
//close the connection
//use prepared statements
$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM todos WHERE id=?");
$stmt->bind_param("i", $id);
if($stmt -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();

?>