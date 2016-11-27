<?php
$servername = "localhost";
$username = "ltraneco_jeff";
$password = "ffeJO211";
$dbname = "ltraneco_reddit_history_gallery";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
?>