<?php
    $username = "username"; 
    $password = "password";   
    $host = "00.000.00.000";
    $database="sample";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

  $sql = "SELECT * FROM DUAL";  

    $query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }

  $data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    
    echo json_encode($data);      
    mysql_close($server);
?>