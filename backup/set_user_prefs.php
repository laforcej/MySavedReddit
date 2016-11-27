<?php

$user_name = $_GET["user_name"];
$user_id = $_GET["user_id"];
$sort_by = $_GET["sort_by"];
$scope = $_GET["scope"];
$response = array();

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

$sql = "INSERT INTO tbl_reddit_users (user_name, user_id) VALUES ('" . $user_name . "','" . $user_id . "')";
$result = $conn->query($sql);

$sql = "INSERT INTO tbl_reddit_user.prefs (tru_id, sort_by, scope) VALUES ('" . new id . "','" . $sort_by . "','" . $scope . "')";

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {

        $response["sort_by"] = $row["sort_by"];
        $response["scope"] = $row["scope"];

        echo json_encode($response);
        
    }
} else {
    echo "{}";
}
$conn->close();
?>