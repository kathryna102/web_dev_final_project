<?php 
//code to connect to the database

$servername = "localhost";
$user = "user31";
$password = "31susy";
$dbname = "db31";

$conn = new mysqli($servername, $user, $password, $dbname);

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>