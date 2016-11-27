<?php

header('Content-Type: application/json');

include 'db.php';

$tru_id = $_POST["tru_id"];
$link_id = $_POST["link_id"];

try {
    $sql = "DELETE FROM tbl_reddit_user_link_ratings WHERE 
            tbl_reddit_user_link_ratings.tru_id = " . $tru_id . " AND tbl_reddit_user_link_ratings.link_id = '" . $link_id . "'";
    $conn->query($sql);
    $conn->close();
} 

catch(Exception $e) {
    echo "{" . $e->getMessage() . "}";
}
?>