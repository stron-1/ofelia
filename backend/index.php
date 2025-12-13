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
                    "token" => bin2hex(random_bytes(16)), 
                    "user" => [
                        "id" => $user['id'],
                        "nombre" => $user['nombre'],
                        "email" => $user['email'],
                        "imagen_url" => $user['imagen_url']
                    ]
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

// --- RUTA: ACTIVIDADES ---
if ($route === 'actividades') {
    // 1. LISTAR (GET) - Con JOIN para traer la galería
    if ($method === 'GET') {
        $pdo->exec("SET SESSION group_concat_max_len = 1000000");
        $categoria = $_GET['categoria'] ?? null;
        
        // Hacemos LEFT JOIN para traer las fotos de la galería concatenadas
        $sql = "SELECT a.*, GROUP_CONCAT(g.imagen_url) as galeria_urls 
                FROM actividades a 
                LEFT JOIN actividades_galeria g ON a.id = g.actividad_id ";
        
        if ($categoria) {
            $sql .= " WHERE a.categoria = ? ";
        }
        
        $sql .= " GROUP BY a.id ORDER BY a.id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($categoria ? [$categoria] : []);
        $resultados = $stmt->fetchAll();

        // Procesamos los resultados para convertir el string "foto1.jpg,foto2.jpg" en un Array real
        foreach ($resultados as &$fila) {
            if (!empty($fila['galeria_urls'])) {
                $fila['galeria'] = explode(',', $fila['galeria_urls']);
            } else {
                $fila['galeria'] = [];
            }
            
            // Truco: Agregamos la portada a la galería si no está repetida, para que el carrusel tenga al menos 1 foto
            if (!empty($fila['imagen_url']) && !in_array($fila['imagen_url'], $fila['galeria'])) {
                array_unshift($fila['galeria'], $fila['imagen_url']);
            }
        }
        echo json_encode($resultados);
    }
    
    // 2. CREAR (POST sin ID)
    elseif ($method === 'POST' && !$id) {
        $imgPortada = guardarImagen($_FILES['imagen'] ?? null);
        
        try {
            // Iniciamos transacción: O se guardan todas las fotos o ninguna
            $pdo->beginTransaction();

            // A. Insertamos la Actividad Principal
            $sql = "INSERT INTO actividades (titulo, descripcion, categoria, imagen_url) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['titulo'], 
                $_POST['descripcion'] ?? '', 
                $_POST['categoria'], 
                $imgPortada
            ]);
            
            // Obtenemos el ID de la actividad recién creada
            $actividadId = $pdo->lastInsertId();

            // B. Procesamos la Galería (Múltiples Archivos)
            if (isset($_FILES['galeria'])) {
                $totalFiles = count($_FILES['galeria']['name']);
                $sqlGaleria = "INSERT INTO actividades_galeria (actividad_id, imagen_url) VALUES (?, ?)";
                $stmtGaleria = $pdo->prepare($sqlGaleria);

                for ($i = 0; $i < $totalFiles; $i++) {
                    // Verificamos errores individuales
                    if ($_FILES['galeria']['error'][$i] === UPLOAD_ERR_OK) {
                        // Reconstruimos el array de archivo individual para usar la funcion guardarImagen
                        $archivoUnico = [
                            'name'     => $_FILES['galeria']['name'][$i],
                            'type'     => $_FILES['galeria']['type'][$i],
                            'tmp_name' => $_FILES['galeria']['tmp_name'][$i],
                            'error'    => $_FILES['galeria']['error'][$i],
                            'size'     => $_FILES['galeria']['size'][$i]
                        ];
                        
                        $nombreGuardado = guardarImagen($archivoUnico);
                        if ($nombreGuardado) {
                            $stmtGaleria->execute([$actividadId, $nombreGuardado]);
                        }
                    }
                }
            }

            $pdo->commit(); // Confirmamos cambios
            echo json_encode(["message" => "Actividad creada con éxito", "id" => $actividadId]);

        } catch (Exception $e) {
            $pdo->rollBack(); // Si falla algo, deshacemos todo
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    // 3. EDITAR (POST con ID)
    elseif ($method === 'POST' && $id) {
        // Nota: Esta es una edición básica, actualiza textos y portada.
        // Las fotos nuevas de galería se AGREGAN a las que ya existen.
        $img = guardarImagen($_FILES['imagen'] ?? null);
        
        try {
            $pdo->beginTransaction();

            $sql = "UPDATE actividades SET titulo=?, descripcion=?, categoria=?";
            $params = [$_POST['titulo'], $_POST['descripcion'] ?? '', $_POST['categoria']];
            
            if ($img) {
                $sql .= ", imagen_url=?";
                $params[] = $img;
            }
            
            $sql .= " WHERE id=?";
            $params[] = $id;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Insertar nuevas fotos a la galería si las enviaron
            if (isset($_FILES['galeria'])) {
                $totalFiles = count($_FILES['galeria']['name']);
                $sqlGaleria = "INSERT INTO actividades_galeria (actividad_id, imagen_url) VALUES (?, ?)";
                $stmtGaleria = $pdo->prepare($sqlGaleria);

                for ($i = 0; $i < $totalFiles; $i++) {
                    if ($_FILES['galeria']['error'][$i] === UPLOAD_ERR_OK) {
                        $archivoUnico = [
                            'name' => $_FILES['galeria']['name'][$i],
                            'tmp_name' => $_FILES['galeria']['tmp_name'][$i],
                            'error' => 0 // Asumimos OK si pasó el if
                        ];
                        // Nota simple para reusar guardarImagen sin todos los campos opcionales
                        $nombreGuardado = guardarImagen($archivoUnico);
                        if ($nombreGuardado) {
                            $stmtGaleria->execute([$id, $nombreGuardado]);
                        }
                    }
                }
            }

            $pdo->commit();
            echo json_encode(["message" => "Actividad actualizada"]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    // 4. ELIMINAR (DELETE)
    elseif ($method === 'DELETE' && $id) {
        // Gracias al ON DELETE CASCADE en la BD, al borrar esto se borra la galería sola
        $stmt = $pdo->prepare("DELETE FROM actividades WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Actividad eliminada"]);
    }
}

    // RUTA DE CONTACTO
    elseif ($route === 'contacto') {
        
        $inputJSON = json_decode(file_get_contents('php://input'), true);
        
        if ($method === 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM mensajes_contacto ORDER BY fecha DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
        }

        elseif ($method === 'POST' && empty($id)) { 
            $nombre = $inputJSON['nombre'] ?? $_POST['nombre'] ?? '';
            $email = $inputJSON['email'] ?? $_POST['email'] ?? '';
            $telefono = $inputJSON['telefono'] ?? $_POST['telefono'] ?? '';
            $mensaje = $inputJSON['mensaje'] ?? $_POST['mensaje'] ?? '';

            if (empty($nombre) || empty($email) || empty($mensaje)) {
                http_response_code(400);
                echo json_encode(["error" => "Nombre, email y mensaje son obligatorios"]);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO mensajes_contacto (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nombre, $email, $telefono, $mensaje]);
            
            echo json_encode(["message" => "Mensaje enviado correctamente"]);
        }

        elseif (($method === 'PUT' || ($method === 'POST' && $id))) {
            $stmt = $pdo->prepare("UPDATE mensajes_contacto SET leido = 1 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Mensaje marcado como leído"]);
        }

        // D. ELIMINAR (DELETE)
        elseif ($method === 'DELETE' && $id) {
            $stmt = $pdo->prepare("DELETE FROM mensajes_contacto WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Mensaje eliminado"]);
        }
    }

    elseif ($route === 'galeria') {
        
        // A. OBTENER FOTOS DE UNA ACTIVIDAD (Con ID para poder borrar)
        if ($method === 'GET' && isset($_GET['actividad_id'])) {
            $stmt = $pdo->prepare("SELECT id, imagen_url FROM actividades_galeria WHERE actividad_id = ?");
            $stmt->execute([$_GET['actividad_id']]);
            echo json_encode($stmt->fetchAll());
        }

        // B. ELIMINAR UNA FOTO ESPECÍFICA DE LA GALERÍA
        elseif ($method === 'DELETE' && $id) {
            // 1. Obtener nombre para borrar archivo físico
            $stmt = $pdo->prepare("SELECT imagen_url FROM actividades_galeria WHERE id = ?");
            $stmt->execute([$id]);
            $foto = $stmt->fetch();

            if ($foto) {
                $rutaArchivo = 'uploads/' . $foto['imagen_url'];
                if (file_exists($rutaArchivo)) {
                    unlink($rutaArchivo); // Borrar archivo
                }
                // 2. Borrar de BD
                $stmt = $pdo->prepare("DELETE FROM actividades_galeria WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(["message" => "Foto eliminada"]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Foto no encontrada"]);
            }
        }
    }

    // ==========================================
    // 7. ELIMINAR PORTADA (NUEVO)
    // ==========================================
    elseif ($route === 'eliminar_portada' && $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $actividad_id = $data['id'] ?? null;

        if ($actividad_id) {
            // 1. Obtener nombre
            $stmt = $pdo->prepare("SELECT imagen_url FROM actividades WHERE id = ?");
            $stmt->execute([$actividad_id]);
            $act = $stmt->fetch();

            if ($act && $act['imagen_url']) {
                $rutaArchivo = 'uploads/' . $act['imagen_url'];
                if (file_exists($rutaArchivo)) {
                    unlink($rutaArchivo);
                }
                // 2. Actualizar BD a NULL
                $stmt = $pdo->prepare("UPDATE actividades SET imagen_url = NULL WHERE id = ?");
                $stmt->execute([$actividad_id]);
                echo json_encode(["message" => "Portada eliminada"]);
            }
        }
    }

    // ==========================================
    // 8. GESTIÓN DE USUARIO (PERFIL)
    // ==========================================
    elseif ($route === 'usuario') {
        
        // A. OBTENER DATOS (GET) - Para recargar el perfil
        if ($method === 'GET' && $id) {
            $stmt = $pdo->prepare("SELECT id, nombre, email, imagen_url FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($user ?: ["error" => "Usuario no encontrado"]);
        }

        // B. ACTUALIZAR PERFIL (POST)
        elseif ($method === 'POST' && $id) {
            
            // 1. Obtener datos actuales para no perder la foto/pass si no se envían
            $stmt = $pdo->prepare("SELECT password_hash, imagen_url FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $currentUser = $stmt->fetch();

            if (!$currentUser) {
                http_response_code(404);
                echo json_encode(["error" => "Usuario no encontrado"]);
                exit;
            }

            // 2. Recoger datos del formulario
            $nombre = $_POST['nombre'] ?? '';
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? ''; // Si viene vacío, no se cambia
            
            if (empty($nombre) || empty($email)) {
                http_response_code(400);
                echo json_encode(["error" => "Nombre y Email son obligatorios"]);
                exit;
            }

            // 3. Manejo de la Imagen (Avatar)
            $imagen_url = $currentUser['imagen_url']; // Por defecto, la que ya tenía
            
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                // Borrar foto anterior si existe para no llenar el servidor
                if ($imagen_url && file_exists('uploads/' . $imagen_url)) {
                    unlink('uploads/' . $imagen_url);
                }
                // Guardar nueva
                $imagen_url = guardarImagen($_FILES['imagen']);
            }

            // 4. Manejo de la Contraseña
            $password_hash = $currentUser['password_hash']; // Por defecto, la que ya tenía
            if (!empty($password)) {
                $password_hash = password_hash($password, PASSWORD_DEFAULT);
            }

            // 5. Actualizar en BD
            $sql = "UPDATE usuarios SET nombre = ?, email = ?, password_hash = ?, imagen_url = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            
            try {
                $stmt->execute([$nombre, $email, $password_hash, $imagen_url, $id]);
                
                // Devolver los datos nuevos para que el frontend se actualice al instante
                echo json_encode([
                    "message" => "Perfil actualizado correctamente",
                    "user" => [
                        "id" => $id,
                        "nombre" => $nombre,
                        "email" => $email,
                        "imagen_url" => $imagen_url
                    ]
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => "Error al actualizar: " . $e->getMessage()]);
            }
        }
    }
?>