-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 30, 2025 at 01:28 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hamasense`
--

-- --------------------------------------------------------

--
-- Table structure for table `plant_types`
--

CREATE TABLE `plant_types` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scientific_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plant_types`
--

INSERT INTO `plant_types` (`id`, `name`, `scientific_name`, `detail`, `img_path`, `created_at`, `updated_at`) VALUES
(3, 'Pisang', 'Musa spp.', 'Tanaman pisang.', NULL, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(4, 'Singkong', 'Manihot esculenta', 'Tanaman singkong/ubi kayu.', NULL, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(7, 'Selada', 'Lactuca sativa', 'Tanaman selada.', NULL, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(8, 'Jagung', 'Zea mays', 'Tanaman jagung.', NULL, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(9, 'Paprika', 'Capsicum annuum', 'Tanaman paprika (bell pepper).', NULL, '2025-12-30 13:07:48', '2025-12-30 13:07:48'),
(10, 'Tomat', 'Solanum lycopersicum', 'Tanaman tomat.', NULL, '2025-12-30 13:07:48', '2025-12-30 13:07:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `plant_types`
--
ALTER TABLE `plant_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `plant_types`
--
ALTER TABLE `plant_types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
