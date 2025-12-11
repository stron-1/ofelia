-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 09-12-2025 a las 18:15:53
-- Versión del servidor: 8.0.44
-- Versión de PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ofelia_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` int NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `categoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `titulo`, `descripcion`, `categoria`, `imagen_url`) VALUES
(8, 'Día de la madre', 'En este día especial la pasamos bien con los papitos de la I.E Ofelia', 'Social', 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_galeria`
--

CREATE TABLE `actividades_galeria` (
  `id` int NOT NULL,
  `actividad_id` int NOT NULL,
  `imagen_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `actividades_galeria`
--

INSERT INTO `actividades_galeria` (`id`, `actividad_id`, `imagen_url`) VALUES
(5, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__21_.jpeg'),
(6, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__20_.jpeg'),
(7, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__19_.jpeg'),
(8, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__18_.jpeg'),
(9, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__17_.jpeg'),
(10, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__16_.jpeg'),
(11, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__15_.jpeg'),
(12, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__14_.jpeg'),
(13, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__13_.jpeg'),
(14, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__12_.jpeg'),
(15, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__11_.jpeg'),
(16, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__10_.jpeg'),
(17, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__9_.jpeg'),
(18, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__8_.jpeg'),
(19, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__7_.jpeg'),
(20, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__6_.jpeg'),
(21, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__5_.jpeg'),
(22, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__4_.jpeg'),
(23, 8, 'uploads/1764024584-WhatsApp_Image_2025-11-22_at_5_35_44_PM__3_.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_administrativo`
--

CREATE TABLE `personal_administrativo` (
  `id` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `turno` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal_administrativo`
--

INSERT INTO `personal_administrativo` (`id`, `nombre`, `cargo`, `turno`, `imagen_url`) VALUES
(1, 'asdasd', 'asdasd', 'Tarde', 'uploads/1763926534-windows_xp.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_directivo`
--

CREATE TABLE `personal_directivo` (
  `id` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `turno` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal_directivo`
--

INSERT INTO `personal_directivo` (`id`, `nombre`, `cargo`, `turno`, `imagen_url`) VALUES
(2, 'Administrador', 'zxczxc', 'Mañana', 'uploads/1763926522-windows_xp.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id` int NOT NULL,
  `grado_id` int NOT NULL,
  `nombre_seccion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `docente_nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `turno` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id`, `grado_id`, `nombre_seccion`, `docente_nombre`, `turno`, `imagen_url`) VALUES
(4, 7, 'b', 'asd', 'Tarde', 'uploads/1763922951-windows_xp.jpeg'),
(5, 7, 'zxc', 'zxc', 'Tarde', 'uploads/1763922981-windows_xp.jpeg'),
(6, 8, 'C', 'dsdse eweqwe rere', 'Tarde', 'uploads/1763922993-Ledy.jpeg'),
(7, 11, 'asde', 'asd', 'Tarde', 'uploads/1763933189-windows_xp.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password_hash`) VALUES
(1, 'Administrador', 'admin@ofelia.com', '$2y$10$rTAIMxaUVG4KIFS3VRivJOjBT0h/iha/HF6Ipe7JU3ePde2KvS.Ie');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `actividades_galeria`
--
ALTER TABLE `actividades_galeria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_actividad_galeria` (`actividad_id`);

--
-- Indices de la tabla `personal_administrativo`
--
ALTER TABLE `personal_administrativo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_directivo`
--
ALTER TABLE `personal_directivo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `actividades_galeria`
--
ALTER TABLE `actividades_galeria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `personal_administrativo`
--
ALTER TABLE `personal_administrativo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `personal_directivo`
--
ALTER TABLE `personal_directivo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades_galeria`
--
ALTER TABLE `actividades_galeria`
  ADD CONSTRAINT `fk_actividad_galeria` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
