<?php
// backend/db.php

// En Docker, el host es el nombre del servicio en docker-compose
$host = 'db'; 
$db   = 'ofelia_db';
$user = 'root'; 
$pass = 'rootpassword'; // La misma que pusimos en docker-compose
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Si falla la conexión, intentamos dar un mensaje JSON claro
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión BD: " . $e->getMessage()]);
    exit;
}
?>