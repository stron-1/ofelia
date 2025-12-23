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
        // Aumentamos el límite para que no corte galerías con muchas fotos
        $pdo->exec("SET SESSION group_concat_max_len = 1000000");
        
        $categoria = $_GET['categoria'] ?? null;
        $params = [];
        
        $sql = "SELECT 
                    a.*, 
                    GROUP_CONCAT(g.imagen_url) as galeria_urls,
                    (SELECT COUNT(*) FROM comentarios c WHERE c.actividad_id = a.id AND c.estado = 'aprobado') as total_comentarios
                FROM actividades a 
                LEFT JOIN actividades_galeria g ON a.id = g.actividad_id ";
        
        // Filtro por categoría (Si es 'Todas' o null, no filtramos)
        if ($categoria && $categoria !== 'Todas') {
            $sql .= " WHERE a.categoria = ? ";
            $params[] = $categoria;
        }
        
        // Agrupamos por ID para que GROUP_CONCAT funcione y ordenamos por el más reciente
        $sql .= " GROUP BY a.id ORDER BY a.id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $resultados = $stmt->fetchAll();

        // PROCESAMIENTO DE DATOS (Formateo para el Frontend)
        foreach ($resultados as &$fila) {
            // Convertimos "foto1.jpg,foto2.jpg" en un Array real ['foto1.jpg', 'foto2.jpg']
            if (!empty($fila['galeria_urls'])) {
                $fila['galeria'] = explode(',', $fila['galeria_urls']);
            } else {
                $fila['galeria'] = [];
            }
            
            // Lógica visual: Si hay portada, la ponemos al inicio de la galería 
            // (si no está ya repetida) para que el carrusel se vea lleno.
            if (!empty($fila['imagen_url']) && !in_array($fila['imagen_url'], $fila['galeria'])) {
                array_unshift($fila['galeria'], $fila['imagen_url']);
            }

            // Limpiamos el campo sucio que usamos para la lógica
            unset($fila['galeria_urls']);
        }
        
        echo json_encode($resultados);
    }
    
// 2. CREAR (POST sin ID)
    elseif ($method === 'POST' && !$id) {
        $imgPortada = guardarImagen($_FILES['imagen'] ?? null);
        $fecha = $_POST['fecha'] ?? date('Y-m-d H:i:s'); // <--- RECIBIMOS LA FECHA
        
        try {
            $pdo->beginTransaction();

            // Insertamos la actividad CON la fecha
            $sql = "INSERT INTO actividades (titulo, descripcion, categoria, imagen_url, fecha_creacion) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $_POST['titulo'], 
                $_POST['descripcion'] ?? '', 
                $_POST['categoria'], 
                $imgPortada,
                $fecha
            ]);
            
            $actividadId = $pdo->lastInsertId();

            // Guardar Galería
            if (isset($_FILES['galeria']) && is_array($_FILES['galeria']['name'])) {
                $sqlGaleria = "INSERT INTO actividades_galeria (actividad_id, imagen_url) VALUES (?, ?)";
                $stmtGaleria = $pdo->prepare($sqlGaleria);
                
                $totalFiles = count($_FILES['galeria']['name']);

                for ($i = 0; $i < $totalFiles; $i++) {
                    if ($_FILES['galeria']['error'][$i] === UPLOAD_ERR_OK) {
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

            $pdo->commit(); 
            echo json_encode(["message" => "Actividad creada con éxito", "id" => $actividadId]);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar: " . $e->getMessage()]);
        }
    }

// 3. EDITAR (POST con ID)
    elseif ($method === 'POST' && $id) {
        $img = guardarImagen($_FILES['imagen'] ?? null);
        $fecha = $_POST['fecha'] ?? date('Y-m-d H:i:s'); // <--- RECIBIMOS LA FECHA
        
        try {
            $pdo->beginTransaction();

            // Actualizamos título, desc, cat y FECHA
            $sql = "UPDATE actividades SET titulo=?, descripcion=?, categoria=?, fecha_creacion=?";
            $params = [$_POST['titulo'], $_POST['descripcion'] ?? '', $_POST['categoria'], $fecha];
            
            if ($img) {
                $sql .= ", imagen_url=?";
                $params[] = $img;
            }
            
            $sql .= " WHERE id=?";
            $params[] = $id;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Agregar nuevas fotos a la galería
            if (isset($_FILES['galeria']) && is_array($_FILES['galeria']['name'])) {
                $sqlGaleria = "INSERT INTO actividades_galeria (actividad_id, imagen_url) VALUES (?, ?)";
                $stmtGaleria = $pdo->prepare($sqlGaleria);
                
                $totalFiles = count($_FILES['galeria']['name']);

                for ($i = 0; $i < $totalFiles; $i++) {
                    if ($_FILES['galeria']['error'][$i] === UPLOAD_ERR_OK) {
                        $archivoUnico = [
                            'name'     => $_FILES['galeria']['name'][$i],
                            'type'     => $_FILES['galeria']['type'][$i],
                            'tmp_name' => $_FILES['galeria']['tmp_name'][$i],
                            'error'    => $_FILES['galeria']['error'][$i],
                            'size'     => $_FILES['galeria']['size'][$i]
                        ];

                        $nombreGuardado = guardarImagen($archivoUnico);
                        if ($nombreGuardado) {
                            $stmtGaleria->execute([$id, $nombreGuardado]);
                        }
                    }
                }
            }

            $pdo->commit();
            echo json_encode(["message" => "Actividad actualizada correctamente"]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar: " . $e->getMessage()]);
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

// --- RUTA: INTERACCIONES SOCIALES (LIKES Y COMENTARIOS) ---
    elseif ($route === 'social') {
        
        $json = json_decode(file_get_contents('php://input'), true);

        // A. DAR LIKE
        if ($method === 'POST' && isset($_GET['accion']) && $_GET['accion'] === 'like') {
            $actividad_id = $json['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;
            if ($actividad_id) {
                $stmt = $pdo->prepare("UPDATE actividades SET likes = likes + 1 WHERE id = ?");
                $stmt->execute([$actividad_id]);
                $stmt = $pdo->prepare("SELECT likes FROM actividades WHERE id = ?");
                $stmt->execute([$actividad_id]);
                echo json_encode(["message" => "Like agregado", "likes" => $stmt->fetch()['likes']]);
            } else {
                http_response_code(400); echo json_encode(["error" => "Falta ID"]);
            }
        }

        // B. PUBLICAR COMENTARIO
        elseif ($method === 'POST' && isset($_GET['accion']) && $_GET['accion'] === 'comentar') {
            $actividad_id = $json['actividad_id'] ?? $_POST['actividad_id'] ?? null;
            $autor = $json['autor'] ?? $_POST['autor'] ?? 'Anónimo';
            $contenido = $json['contenido'] ?? $_POST['contenido'] ?? '';

            if ($actividad_id && !empty($contenido)) {
                $stmt = $pdo->prepare("INSERT INTO comentarios (actividad_id, autor, contenido, estado, fecha) VALUES (?, ?, ?, 'pendiente', NOW())");
                $stmt->execute([$actividad_id, $autor, $contenido]);
                echo json_encode(["message" => "Comentario enviado a moderación"]);
            } else {
                http_response_code(400); echo json_encode(["error" => "Faltan datos"]);
            }
        }

        // C. OBTENER COMENTARIOS APROBADOS
        elseif ($method === 'GET' && isset($_GET['actividad_id'])) {
            $stmt = $pdo->prepare("SELECT id, autor, contenido, fecha FROM comentarios WHERE actividad_id = ? AND estado = 'aprobado' ORDER BY fecha DESC");
            $stmt->execute([$_GET['actividad_id']]);
            echo json_encode($stmt->fetchAll());
        }

        // D. GESTIÓN ADMIN: Ver Pendientes
        elseif ($method === 'GET' && isset($_GET['admin_pendientes'])) {
            $sql = "SELECT c.*, a.titulo as actividad_titulo FROM comentarios c JOIN actividades a ON c.actividad_id = a.id WHERE c.estado = 'pendiente' ORDER BY c.fecha DESC";
            $stmt = $pdo->query($sql);
            echo json_encode($stmt->fetchAll());
        }
        
        // E. GESTIÓN ADMIN: Aprobar
        elseif (($method === 'PUT' || $method === 'POST') && isset($_GET['accion']) && $_GET['accion'] === 'aprobar') {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE comentarios SET estado = 'aprobado' WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(["message" => "Comentario aprobado"]);
            } else {
                http_response_code(400); echo json_encode(["error" => "Falta ID"]);
            }
        }

        // F. GESTIÓN ADMIN: Rechazar/Borrar
        elseif ($method === 'DELETE' && $id) {
            $stmt = $pdo->prepare("DELETE FROM comentarios WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Comentario eliminado"]);
        }

    }

// --- RUTA: NOTIFICACIONES ---
    elseif ($route === 'notificaciones') {
        
        // 1. OBTENER CONTEO (GET)
        if ($method === 'GET') {
            // CAMBIO CLAVE: Contamos solo los pendientes que NO han sido vistos (visto = 0)
            $sqlCom = "SELECT COUNT(*) as total FROM comentarios WHERE estado = 'pendiente' AND visto = 0";
            $stmtCom = $pdo->query($sqlCom);
            $numComentarios = $stmtCom->fetch()['total'];

            // Contar Mensajes No Leídos
            $sqlMsj = "SELECT COUNT(*) as total FROM mensajes_contacto WHERE leido = 0";
            $stmtMsj = $pdo->query($sqlMsj);
            $numMensajes = $stmtMsj->fetch()['total'];

            echo json_encode([
                'comentarios' => $numComentarios,
                'mensajes' => $numMensajes,
                'total' => $numComentarios + $numMensajes
            ]);
            exit;
        }
        
        // 2. MARCAR COMO LEÍDO/VISTO (POST)
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $tipo = $data['tipo'] ?? '';

            if ($tipo === 'mensajes') {
                // Marca mensajes como leídos
                $pdo->query("UPDATE mensajes_contacto SET leido = 1 WHERE leido = 0");
                echo json_encode(["message" => "Mensajes marcados"]);
            } 
            elseif ($tipo === 'comentarios') {
                // NUEVO: Marca comentarios como vistos (aunque sigan pendientes)
                $pdo->query("UPDATE comentarios SET visto = 1 WHERE estado = 'pendiente' AND visto = 0");
                echo json_encode(["message" => "Comentarios marcados como vistos"]);
            }
            exit;
        }
    }
?>