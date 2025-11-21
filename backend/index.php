<?php
// Permisos CORS para que React pueda hablar con XAMPP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require 'db.php';

// Rutas: ?route=secciones
$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Helper para guardar imágenes en la carpeta uploads
function guardarImagen($archivo) {
    if (!isset($archivo) || $archivo['error'] !== UPLOAD_ERR_OK) return null;
    
    $dir = 'uploads/'; // Guardamos en backend/uploads
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    
    $ext = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nombre = time() . '-' . preg_replace('/[^A-Za-z0-9\-]/', '_', pathinfo($archivo['name'], PATHINFO_FILENAME)) . '.' . $ext;
    
    if (move_uploaded_file($archivo['tmp_name'], $dir . $nombre)) {
        // Retornamos la ruta relativa. OJO: Ajustar según necesite el frontend.
        // Como el PHP está en /backend/, la ruta web será uploads/foto.jpg
        return 'backend/uploads/' . $nombre; 
    }
    return null;
}

// --- RUTA: LOGIN ---
if ($route === 'login' && $method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$input['email']]);
    $user = $stmt->fetch();

    // IMPORTANTE: Si usaste el hash del ejemplo anterior ($2y$10$beh2...), la clave es '123456'
    if ($user && password_verify($input['password'], $user['password_hash'])) {
        echo json_encode([
            "message" => "Login exitoso",
            "token" => "token_simulado_" . time(),
            "user" => ["id" => $user['id'], "nombre" => $user['nombre'], "email" => $user['email']]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Credenciales incorrectas"]);
    }
    exit;
}

// --- RUTA: SECCIONES ---
if ($route === 'secciones') {
    if ($method === 'GET') {
        $grado = $_GET['grado_id'] ?? null;
        $sql = "SELECT * FROM secciones" . ($grado ? " WHERE grado_id = ?" : "") . " ORDER BY nombre_seccion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($grado ? [$grado] : []);
        echo json_encode($stmt->fetchAll());
    }
    elseif ($method === 'POST' && !$id) { // CREAR
        $img = guardarImagen($_FILES['imagen'] ?? null);
        $stmt = $pdo->prepare("INSERT INTO secciones (grado_id, nombre_seccion, docente_nombre, turno, imagen_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$_POST['grado_id'], $_POST['nombre_seccion'], $_POST['docente_nombre'], $_POST['turno'], $img]);
        echo json_encode(["message" => "Creado"]);
    }
    elseif ($method === 'POST' && $id) { // EDITAR (Simulamos PUT)
        $img = guardarImagen($_FILES['imagen'] ?? null);
        $sql = "UPDATE secciones SET nombre_seccion=?, docente_nombre=?, turno=?";
        $params = [$_POST['nombre_seccion'], $_POST['docente_nombre'], $_POST['turno']];
        if ($img) { $sql .= ", imagen_url=?"; $params[] = $img; }
        $sql .= " WHERE id=?"; $params[] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["message" => "Actualizado"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM secciones WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Eliminado"]);
    }
}

// --- RUTA: PERSONAL (Directivos y Administrativos) ---
// Lógica reutilizable para ambas tablas
$tabla = ($route === 'directivos') ? 'personal_directivo' : (($route === 'administrativos') ? 'personal_administrativo' : null);

if ($tabla) {
    if ($method === 'GET') {
        echo json_encode($pdo->query("SELECT * FROM $tabla ORDER BY id")->fetchAll());
    }
    elseif ($method === 'POST' && !$id) {
        $img = guardarImagen($_FILES['imagen'] ?? null);
        $stmt = $pdo->prepare("INSERT INTO $tabla (nombre, cargo, turno, imagen_url) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_POST['nombre'], $_POST['cargo'], $_POST['turno'], $img]);
        echo json_encode(["message" => "Creado"]);
    }
    elseif ($method === 'POST' && $id) {
        $img = guardarImagen($_FILES['imagen'] ?? null);
        $sql = "UPDATE $tabla SET nombre=?, cargo=?, turno=?";
        $params = [$_POST['nombre'], $_POST['cargo'], $_POST['turno']];
        if ($img) { $sql .= ", imagen_url=?"; $params[] = $img; }
        $sql .= " WHERE id=?"; $params[] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["message" => "Actualizado"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM $tabla WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Eliminado"]);
    }
}
?>