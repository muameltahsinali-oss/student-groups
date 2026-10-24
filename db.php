<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // Default XAMPP password
$dbname = 'groups_system';

// Attempt to connect to MySQL to create DB if it doesn't exist
$conn_init = new mysqli($host, $user, $pass);
if ($conn_init->connect_error) {
    die("Connection failed: " . $conn_init->connect_error);
}

$sql_create_db = "CREATE DATABASE IF NOT EXISTS $dbname";
$conn_init->query($sql_create_db);
$conn_init->close();

// Connect to the specific database
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create table if it doesn't exist
$sql_create_table = "CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL
)";
$conn->query($sql_create_table);
?>
