<?php
// backend/index.php

// Configuración de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require 'db.php';

$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// --- FUNCIÓN PARA GUARDAR IMÁGENES ---
function guardarImagen($archivo) {
    // Validar si se subió un archivo sin errores
    if (!isset($archivo) || $archivo['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    
    $dir = 'uploads/';
    
    // Crear carpeta si no existe (Permisos 777 para Linux)
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    
    $ext = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nombreBase = pathinfo($archivo['name'], PATHINFO_FILENAME);
    // Limpiar nombre de archivo
    $nombreLimpio = preg_replace('/[^A-Za-z0-9\-]/', '_', $nombreBase);
    $nombreFinal = time() . '-' . $nombreLimpio . '.' . $ext;
    
    if (move_uploaded_file($archivo['tmp_name'], $dir . $nombreFinal)) {
        // Retornamos la ruta relativa limpia (ej: uploads/foto.jpg)
        return 'uploads/' . $nombreFinal; 
    }
    
    return null;
}

// --- RUTA: LOGIN ---
if ($route === 'login' && $method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$input['email']]);
    $user = $stmt->fetch();

    if ($user && password_verify($input['password'], $user['password_hash'])) {
        echo json_encode([
            "message" => "Login exitoso",
            "token" => "token_dummy_" . time(),
            "user" => ["id" => $user['id'], "nombre" => $user['nombre'], "email" => $user['email']]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Credenciales incorrectas"]);
    }
    exit;
}

// --- RUTA: SECCIONES (PRIMARIA Y SECUNDARIA) ---
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
        
        $sql = "INSERT INTO secciones (grado_id, nombre_seccion, docente_nombre, turno, imagen_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        try {
            $stmt->execute([$_POST['grado_id'], $_POST['nombre_seccion'], $_POST['docente_nombre'], $_POST['turno'], $img]);
            echo json_encode(["message" => "Creado exitosamente", "ruta_imagen" => $img]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    elseif ($method === 'POST' && $id) { // EDITAR (POST con ID simula PUT)
        $img = guardarImagen($_FILES['imagen'] ?? null);
        
        $sql = "UPDATE secciones SET nombre_seccion=?, docente_nombre=?, turno=?";
        $params = [$_POST['nombre_seccion'], $_POST['docente_nombre'], $_POST['turno']];
        
        // Solo actualizamos la imagen si el usuario subió una nueva
        if ($img) { 
            $sql .= ", imagen_url=?"; 
            $params[] = $img; 
        }
        
        $sql .= " WHERE id=?"; 
        $params[] = $id;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["message" => "Actualizado exitosamente", "ruta_imagen" => $img]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM secciones WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Eliminado"]);
    }
}

// --- RUTAS: PERSONAL (Directivos y Administrativos) ---
$tabla = null;
if ($route === 'directivos') {
    $tabla = 'personal_directivo';
} elseif ($route === 'administrativos') {
    $tabla = 'personal_administrativo';
}

if ($tabla) {
    try {
        if ($method === 'GET') {
            // Usamos prepare/execute para evitar errores si la tabla no existe
            $stmt = $pdo->query("SELECT * FROM $tabla ORDER BY id");
            if ($stmt === false) {
                // Si falla la consulta, lanzamos error manual para verlo en consola
                throw new Exception("Error al consultar la tabla '$tabla'. Verifica que exista en la BD.");
            }
            echo json_encode($stmt->fetchAll());
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
    } catch (Exception $e) {
        // ESTO ES LO IMPORTANTE: Devuelve el error real en lugar de 500
        http_response_code(500);
        echo json_encode(["error" => "Error en servidor: " . $e->getMessage()]);
    }
}
?>