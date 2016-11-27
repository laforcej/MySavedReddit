<?php
// Start the session
session_start();

$_SESSION["rdn_str"] = generateRandomString();
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>

<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" type="text/css" href="styles/reset.css">    
<link rel="stylesheet" type="text/css" href="styles/styles.css">    
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<body>
    <div id="container">
        <header>
            <div id="site-title"><img src="images/header.png" width="225" height="21"/></div>
        </header>
        <div id="welcome-text">
            <p>Click the link below to log in to reddit and allow this website to access your saved posts. Once logged in, you will be redirected back to mysavedreddit.com to experience a new way of viewing your saved reddit posts.</p>
            <a href="https://www.reddit.com/api/v1/authorize?client_id=bet0G9mwW8Xw_g&response_type=code&state=<?=$_SESSION["rdn_str"]?>&redirect_uri=http://www.ltrane.com/oauth/main.php&duration=permanent&scope=identity,history,save">Log in to Reddit</a>
        </div>
    </div>
</body>
</html>