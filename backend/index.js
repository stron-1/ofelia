// backend/index.js (Código Completo y Corregido)

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Configuración de Multer (Sin cambios) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); // Reemplaza espacios en nombres de archivo
  }
});
const upload = multer({ storage: storage });

// --- Conexión a la BD (Sin cambios) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ Error inicial al conectar con la BD:', err);
  else console.log('✅ Base de Datos conectada:', res.rows[0].now);
});

// --- FUNCIÓN DE INICIALIZACIÓN (Más robusta) ---
const inicializarDB = async () => {
  const client = await pool.connect(); // Usar un cliente para transacciones
  try {
    await client.query('BEGIN'); // Iniciar transacción

    // 1. Tabla usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY, nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL, password_hash VARCHAR(100) NOT NULL
      );
    `);
    console.log('✅ Tabla "usuarios" verificada.');

    // 2. Tabla secciones (Crear si no existe)
    await client.query(`
      CREATE TABLE IF NOT EXISTS secciones (
        id SERIAL PRIMARY KEY, grado_id INTEGER NOT NULL,
        nombre_seccion VARCHAR(100) NOT NULL, docente_nombre VARCHAR(255) NOT NULL,
        turno VARCHAR(50) NOT NULL
      );
    `);
    console.log('✅ Tabla "secciones" verificada.');
    // Añadir columna imagen_url si no existe
    const checkColSec = await client.query(`SELECT 1 FROM information_schema.columns WHERE table_name = 'secciones' AND column_name = 'imagen_url'`);
    if (checkColSec.rows.length === 0) {
      await client.query('ALTER TABLE secciones ADD COLUMN imagen_url VARCHAR(255)');
      console.log('✅ Columna "imagen_url" añadida a "secciones".');
    }

    // 3. Tabla personal_directivo (Crear si no existe)
    await client.query(`
      CREATE TABLE IF NOT EXISTS personal_directivo (
        id SERIAL PRIMARY KEY, nombre VARCHAR(255) NOT NULL,
        cargo VARCHAR(100) NOT NULL, turno VARCHAR(50) NOT NULL
      );
    `);
    console.log('✅ Tabla "personal_directivo" verificada.');
    // Añadir columna imagen_url si no existe
    const checkColDir = await client.query(`SELECT 1 FROM information_schema.columns WHERE table_name = 'personal_directivo' AND column_name = 'imagen_url'`);
    if (checkColDir.rows.length === 0) {
      await client.query('ALTER TABLE personal_directivo ADD COLUMN imagen_url VARCHAR(255)');
      console.log('✅ Columna "imagen_url" añadida a "personal_directivo".');
    }

    // 4. Tabla personal_administrativo (Crear si no existe)
    await client.query(`
      CREATE TABLE IF NOT EXISTS personal_administrativo (
        id SERIAL PRIMARY KEY, nombre VARCHAR(255) NOT NULL,
        cargo VARCHAR(100) NOT NULL, turno VARCHAR(50) NOT NULL
      );
    `);
    console.log('✅ Tabla "personal_administrativo" verificada.');
    // Añadir columna imagen_url si no existe
    const checkColAdm = await client.query(`SELECT 1 FROM information_schema.columns WHERE table_name = 'personal_administrativo' AND column_name = 'imagen_url'`);
    if (checkColAdm.rows.length === 0) {
      await client.query('ALTER TABLE personal_administrativo ADD COLUMN imagen_url VARCHAR(255)');
      console.log('✅ Columna "imagen_url" añadida a "personal_administrativo".');
    }

    await client.query('COMMIT'); // Confirmar cambios si todo fue bien
    console.log('✅ Inicialización de BD completada exitosamente.');

  } catch (err) {
    await client.query('ROLLBACK'); // Deshacer cambios si hubo error
    console.error('❌ Error GRAVE al inicializar tablas:', err);
    // Es importante detener el proceso si la BD no se puede inicializar
    process.exit(1);
  } finally {
    client.release(); // Liberar el cliente de la pool
  }
};

// --- RUTAS AUTH (Funcionando) ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    // Verificar usuario y contraseña
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      // Usar un mensaje genérico para seguridad
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Expiración de 1 hora
    );

    // Enviar respuesta exitosa
    res.json({
      message: 'Login exitoso',
      token: token,
      user: { id: user.id, email: user.email, nombre: user.nombre },
    });

  } catch (err) {
    // Loguear el error real en el servidor
    console.error('Error crítico en /login:', err);
    // Enviar un mensaje genérico al cliente
    res.status(500).json({ error: 'Error interno del servidor. Intente más tarde.' });
  }
});

// --- RUTAS CRUD SECCIONES (Funcionando) ---
app.post('/secciones', upload.single('imagen'), async (req, res) => {
  const { grado_id, nombre_seccion, docente_nombre, turno } = req.body;
  const imagen_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
  try {
    const result = await pool.query( 'INSERT INTO secciones (grado_id, nombre_seccion, docente_nombre, turno, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [grado_id, nombre_seccion, docente_nombre, turno, imagen_url] );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error('Error POST /secciones:', err); res.status(500).json({ error: 'Error al crear sección' }); }
});
app.get('/secciones/:grado_id', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM secciones WHERE grado_id = $1 ORDER BY nombre_seccion', [req.params.grado_id]); res.json(result.rows); }
  catch (err) { console.error('Error GET /secciones/:grado_id:', err); res.status(500).json({ error: 'Error al obtener secciones' }); }
});
app.put('/secciones/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params; const { nombre_seccion, docente_nombre, turno } = req.body;
  try {
    const oldResult = await pool.query('SELECT imagen_url FROM secciones WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) return res.status(404).json({ error: 'Sección no encontrada' });
    let currentImageUrl = oldResult.rows[0]?.imagen_url;
    if (req.file) { if (currentImageUrl && fs.existsSync(currentImageUrl)) fs.unlinkSync(currentImageUrl); currentImageUrl = req.file.path.replace(/\\/g, '/'); }
    const result = await pool.query( 'UPDATE secciones SET nombre_seccion = $1, docente_nombre = $2, turno = $3, imagen_url = $4 WHERE id = $5 RETURNING *', [nombre_seccion, docente_nombre, turno, currentImageUrl, id] );
    res.json(result.rows[0]);
  } catch (err) { console.error(`Error PUT /secciones/${id}:`, err); res.status(500).json({ error: 'Error al actualizar sección' }); }
});
app.delete('/secciones/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM secciones WHERE id = $1 RETURNING imagen_url', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sección no encontrada' });
    const imgUrl = result.rows[0].imagen_url; if (imgUrl && fs.existsSync(imgUrl)) fs.unlinkSync(imgUrl);
    res.json({ message: 'Sección eliminada exitosamente' });
  } catch (err) { console.error(`Error DELETE /secciones/${req.params.id}:`, err); res.status(500).json({ error: 'Error al eliminar sección' }); }
});

// --- RUTAS CRUD DIRECTIVOS (Funcionando) ---
app.post('/directivos', upload.single('imagen'), async (req, res) => {
  const { nombre, cargo, turno } = req.body;
  const imagen_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
  try {
    const result = await pool.query( 'INSERT INTO personal_directivo (nombre, cargo, turno, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, cargo, turno, imagen_url] );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error('Error POST /directivos:', err); res.status(500).json({ error: 'Error al crear directivo' }); }
});
app.get('/directivos', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM personal_directivo ORDER BY id'); res.json(result.rows); }
  catch (err) { console.error('Error GET /directivos:', err); res.status(500).json({ error: 'Error al obtener directivos' }); }
});
app.put('/directivos/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params; const { nombre, cargo, turno } = req.body;
  try {
    const oldResult = await pool.query('SELECT imagen_url FROM personal_directivo WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) return res.status(404).json({ error: 'Directivo no encontrado' });
    let currentImageUrl = oldResult.rows[0]?.imagen_url;
    if (req.file) { if (currentImageUrl && fs.existsSync(currentImageUrl)) fs.unlinkSync(currentImageUrl); currentImageUrl = req.file.path.replace(/\\/g, '/'); }
    const result = await pool.query( 'UPDATE personal_directivo SET nombre = $1, cargo = $2, turno = $3, imagen_url = $4 WHERE id = $5 RETURNING *', [nombre, cargo, turno, currentImageUrl, id] );
    res.json(result.rows[0]);
  } catch (err) { console.error(`Error PUT /directivos/${id}:`, err); res.status(500).json({ error: 'Error al actualizar directivo' }); }
});
app.delete('/directivos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM personal_directivo WHERE id = $1 RETURNING imagen_url', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Directivo no encontrado' });
    const imgUrl = result.rows[0].imagen_url; if (imgUrl && fs.existsSync(imgUrl)) fs.unlinkSync(imgUrl);
    res.json({ message: 'Directivo eliminado exitosamente' });
  } catch (err) { console.error(`Error DELETE /directivos/${req.params.id}:`, err); res.status(500).json({ error: 'Error al eliminar directivo' }); }
});

// --- RUTAS CRUD ADMINISTRATIVOS (Funcionando) ---
app.post('/administrativos', upload.single('imagen'), async (req, res) => {
  const { nombre, cargo, turno } = req.body;
  const imagen_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
  try {
    const result = await pool.query( 'INSERT INTO personal_administrativo (nombre, cargo, turno, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, cargo, turno, imagen_url] );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error('Error POST /administrativos:', err); res.status(500).json({ error: 'Error al crear administrativo' }); }
});
app.get('/administrativos', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM personal_administrativo ORDER BY id'); res.json(result.rows); }
  catch (err) { console.error('Error GET /administrativos:', err); res.status(500).json({ error: 'Error al obtener administrativos' }); }
});
app.put('/administrativos/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params; const { nombre, cargo, turno } = req.body;
  try {
    const oldResult = await pool.query('SELECT imagen_url FROM personal_administrativo WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) return res.status(404).json({ error: 'Administrativo no encontrado' });
    let currentImageUrl = oldResult.rows[0]?.imagen_url;
    if (req.file) { if (currentImageUrl && fs.existsSync(currentImageUrl)) fs.unlinkSync(currentImageUrl); currentImageUrl = req.file.path.replace(/\\/g, '/'); }
    const result = await pool.query( 'UPDATE personal_administrativo SET nombre = $1, cargo = $2, turno = $3, imagen_url = $4 WHERE id = $5 RETURNING *', [nombre, cargo, turno, currentImageUrl, id] );
    res.json(result.rows[0]);
  } catch (err) { console.error(`Error PUT /administrativos/${id}:`, err); res.status(500).json({ error: 'Error al actualizar administrativo' }); }
});
app.delete('/administrativos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM personal_administrativo WHERE id = $1 RETURNING imagen_url', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Administrativo no encontrado' });
    const imgUrl = result.rows[0].imagen_url; if (imgUrl && fs.existsSync(imgUrl)) fs.unlinkSync(imgUrl);
    res.json({ message: 'Administrativo eliminado exitosamente' });
  } catch (err) { console.error(`Error DELETE /administrativos/${req.params.id}:`, err); res.status(500).json({ error: 'Error al eliminar administrativo' }); }
});

// --- Iniciar Servidor ---
// Llamamos a inicializarDB() ANTES de empezar a escuchar
inicializarDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Servidor backend escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // Si inicializarDB falló (process.exit(1)), esto no se ejecutará,
    // pero es buena práctica tener un catch aquí.
    console.error('❌ Falló el inicio del servidor debido a error en inicializarDB:', err);
  });