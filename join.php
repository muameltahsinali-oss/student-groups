<?php
header('Content-Type: application/json');
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $team = trim($_POST['team'] ?? '');

    if (empty($name) || empty($team)) {
        echo json_encode(['success' => false, 'message' => 'الاسم والفريق مطلوبان.']);
        exit;
    }

    // Check if name already exists in the same team
    $stmt_check = $conn->prepare("SELECT id FROM members WHERE name = ? AND team = ?");
    $stmt_check->bind_param("ss", $name, $team);
    $stmt_check->execute();
    $stmt_check->store_result();
    if ($stmt_check->num_rows > 0) {
        $stmt_check->close();
        echo json_encode(['success' => false, 'message' => 'هذا الاسم موجود بالفعل في هذا الفريق.']);
        exit;
    }
    $stmt_check->close();

    $stmt = $conn->prepare("INSERT INTO members (name, team) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $team);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'تم الانضمام بنجاح.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'خطأ في قاعدة البيانات.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'طريقة طلب غير صالحة.']);
}

$conn->close();
?>
