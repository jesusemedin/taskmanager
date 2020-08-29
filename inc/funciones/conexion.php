<?php
$conn = new mysqli('localhost', 'root', '751602', 'uptask');
if($conn->connect_error){
    echo $conn->connect_error;
}
$conn->set_charset('utf8');
?>