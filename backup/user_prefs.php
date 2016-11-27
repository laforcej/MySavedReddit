<?php

$user_name = $_GET["user_name"];
$user_id = $_GET["user_id"];
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

$sql = "SELECT tbl_reddit_user_prefs.* FROM tbl_reddit_user_prefs INNER JOIN tbl_reddit_users ON tbl_reddit_users.id = tbl_reddit_user_prefs.tru_id WHERE tbl_reddit_users.user_id = '" . $user_id . "' LIMIT 0 , 30";
$result = $conn->query($sql);

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