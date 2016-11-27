<?php

header('Content-Type: application/json');

include 'db.php';

$tru_id = $_POST["tru_id"];
$link_id = $_POST["link_id"];
$rating = $_POST["rating"];

//check to see if link exists

//if exists update rating in table

try {
    $sql = "SELECT tbl_reddit_user_link_ratings.tru_id FROM tbl_reddit_user_link_ratings WHERE 
            tbl_reddit_user_link_ratings.tru_id = " . $tru_id . " AND tbl_reddit_user_link_ratings.link_id = '" . $link_id . "'";
    $result = $conn->query($sql);

     echo $sql;
    
    if ($result->num_rows > 0) {
        $sql = "UPDATE tbl_reddit_user_link_ratings SET rating = " . $rating . " WHERE tbl_reddit_user_link_ratings.link_id = '" . $link_id . "' AND tbl_reddit_user_link_ratings.tru_id = " . $tru_id;
        $conn->query($sql);
    } else {
        $sql = "INSERT INTO tbl_reddit_user_link_ratings (id, tru_id, link_id, rating) VALUES (NULL, " . $tru_id . ", '" . $link_id . "', " . $rating . ")";
        echo "insert: " . $sql;
        $conn->query($sql);
    }
    
    echo "{}";
} 

catch(Exception $e) {
    echo "{" . $e->getMessage() . "}";
}

//else insert rating in table

$conn->close();
?>