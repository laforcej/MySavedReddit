<?php

header('Content-Type: application/json');

include 'db.php';

$user_name = $_POST["user_name"];
$user_id = $_POST["user_id"];

$response = array();

try {
    $sql = "SELECT tbl_reddit_user_prefs.* FROM tbl_reddit_user_prefs 
            INNER JOIN tbl_reddit_users ON tbl_reddit_users.id = tbl_reddit_user_prefs.tru_id 
            WHERE tbl_reddit_users.user_id = '" . $user_id . "' LIMIT 0 , 30";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {

            $response["sort_by"] = $row["sort_by"];
            $response["scope"] = $row["scope"];
            $response["tru_id"] = $row["tru_id"];
            $response["group_by_subreddit"] = $row["group_by_subreddit"];
            $response["filter_by"] = $row["filter_by"];
            $response["view_as_gallery"] = $row["view_as_gallery"];
            echo json_encode($response);
        }

    } else {
        echo '{"no_preferences":true}';
    }
    $conn->close();
}

catch(Exception $e) {
    echo "{" . $e->getMessage() . "}";
}
?>