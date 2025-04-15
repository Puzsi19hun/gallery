<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php
    // Kapcsolódás
    $servername = "localhost";
    $username = "thozoo";
    $password = "thisIsMor1czCloudMF!?";
    $database = "thozoo_wp";

    // Create connection
    $con = mysqli_connect($servername, $username, $password, $database);

    // Check connection
    if (!$con) {
    die("Connection failed");
    }

    // Ha idáig eljutottam, akkor fel vagyok csatlakozva.

    // Jön a lekérdezés

    $r = mysqli_query($con, "SELECT * FROM kajak");
    echo '<table border=1>';
    while ($row = mysqli_fetch_assoc($r))
    {
        echo "<tr><td>".$row['kaja_nev']."</td><td>".$row['kaja_ertekeles']."</td></tr>";
    }
    echo '</table>';
?>
</body>
</html>

