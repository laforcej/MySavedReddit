<?php

include 'db.php';

$tru_id = $_GET["tru_id"];
$counter = 0;

$response = array();

try {
    $sql = "SELECT tbl_reddit_user_link_ratings.* FROM \n"
        . " tbl_reddit_user_link_ratings WHERE \n"
        . " tbl_reddit_user_link_ratings.tru_id = " . $tru_id;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        echo "[";
        while($row = $result->fetch_assoc()) {

            $response["link_id"] = $row["link_id"];
            $response["rating"] = $row["rating"];

            if($counter > 0) {
                echo "," . json_encode($response);  
            } else {
                echo json_encode($response);  
            }

            $counter += 1;
        }
        echo "]";

    } else {
        echo "{}";
    }
    $conn->close();
} 

catch(Exception $e) {
    echo "{" . $e->getMessage() . "}";
}

?>