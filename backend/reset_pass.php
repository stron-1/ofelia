<?php
// backend/reset_pass.php
require 'db.php';

$email = 'admin@ofelia.com';
$nueva_pass = '123456';

// Generamos el hash correcto usando TU versión de PHP
$hash = password_hash($nueva_pass, PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET password_hash = :pass WHERE email = :email";
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([':pass' => $hash, ':email' => $email]);
    echo "<h1>¡Éxito!</h1>";
    echo "La contraseña para <b>$email</b> se ha reseteado a: <b>$nueva_pass</b><br>";
    echo "Hash generado: $hash";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>