<?php
header('Content-Type: application/json');
require 'db.php';

$teams = [
    "مؤمل" => [],
    "احمد عدي" => [],
    "فقار" => []
];

$sql = "SELECT name, team FROM members";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $team = $row['team'];
        $name = htmlspecialchars($row['name']);
        if (isset($teams[$team])) {
            $teams[$team][] = $name;
        }
    }
}

echo json_encode($teams);
$conn->close();
?>
