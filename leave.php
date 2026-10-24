<?php
header('Content-Type: application/json');
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'الاسم مطلوب.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM members WHERE name = ?");
    $stmt->bind_param("s", $name);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'تمت المغادرة بنجاح.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'خطأ في قاعدة البيانات.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'طريقة طلب غير صالحة.']);
}

$conn->close();
?>
