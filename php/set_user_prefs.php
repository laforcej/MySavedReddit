<?php

header('Content-Type: application/json');

include 'db.php';

$sort_by = $_POST["sort_by"];
$scope = $_POST["scope"];
$group_by_subreddit = $_POST["group_by_subreddit"];
$filter_by = $_POST["filter_by"];
$tru_id = $_POST["tru_id"];
$user_name = $_POST["user_name"];
$user_id = $_POST["user_id"];
$view_as_gallery = $_POST["view_as_gallery"];

try {
    //if $tru_id is null then enter user in tbl reddit user database
    if($tru_id == -1) {
        $sql = "INSERT INTO tbl_reddit_users
                (id, user_name, user_id)
                VALUES
                (NULL, '" . $user_name . "', '" . $user_id . "')";
        $conn->query($sql);
        
        $sql = "SELECT id FROM tbl_reddit_users WHERE tbl_reddit_users.user_name = '" . $user_name . "'";
        $result = $conn->query($sql);
        
        $tru_id = $row["id"];
    }
    
    
    $sql = "SELECT tru_id FROM tbl_reddit_user_prefs WHERE tbl_reddit_user_prefs.tru_id = " . $tru_id;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        //UPDATE
        $sql = "UPDATE tbl_reddit_user_prefs SET 
                sort_by = '" . $sort_by . "', scope = '" . $scope . "', group_by_subreddit = " . $group_by_subreddit . ", filter_by = " . $filter_by . ", view_as_gallery = " . $view_as_gallery . "
                WHERE 
                tbl_reddit_user_prefs.tru_id = " . $tru_id;
        $conn->query($sql);
    } else {
        //INSERT
        $sql = "INSERT INTO tbl_reddit_user_prefs 
               (id, tru_id, sort_by, scope, filter_by, group_by_subreddit, view_as_gallery) 
               VALUES
               (NULL, '" . $sort_by . "', '" . $scope . "', " . $filter_by . ", " . $group_by_subreddit . ", " . $view_as_gallery . ")";
        $conn->query($sql);
    }
    $conn->close();
    echo "{}";
}


catch(Exception $e) {
    echo "{" . $e->getMessage() . "}";
}
?>