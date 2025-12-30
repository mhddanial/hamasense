-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 30, 2025 at 01:09 PM
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
-- Table structure for table `diseases`
--

CREATE TABLE `diseases` (
  `id` bigint UNSIGNED NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity_level` enum('rendah','sedang','tinggi') COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plant_type_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `diseases`
--

INSERT INTO `diseases` (`id`, `label`, `name`, `description`, `severity_level`, `img_path`, `plant_type_id`, `created_at`, `updated_at`) VALUES
(1, 'banana_bract_mosaic_virus_disease', 'Virus Mosaik Bract Pisang', 'Penyakit virus yang menimbulkan gejala mosaik/bercak pada daun/bract pisang.', 'sedang', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(2, 'banana_cordana', 'Bercak Daun Cordana (Pisang)', 'Bercak pada daun pisang akibat Cordana; menurunkan kualitas daun dan fotosintesis.', 'sedang', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(3, 'banana_insect_pest_disease', 'Serangan Hama Serangga (Pisang)', 'Kerusakan daun akibat hama serangga (mis. gigitan/kunyahan) yang mengganggu pertumbuhan.', 'sedang', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(4, 'banana_leaf_healthy', 'Daun Pisang Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(5, 'banana_moko_disease', 'Penyakit Moko (Layu Bakteri) Pisang', 'Penyakit layu bakteri (moko) yang dapat menyebabkan tanaman layu dan mati.', 'tinggi', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(6, 'banana_panama_disease', 'Penyakit Panama (Layu Fusarium) Pisang', 'Layu Fusarium pada pisang; menyebabkan daun menguning, layu, hingga kematian tanaman.', 'tinggi', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(7, 'banana_pestalotiopsis', 'Bercak Daun Pestalotiopsis (Pisang)', 'Infeksi jamur Pestalotiopsis yang memicu bercak dan nekrosis pada daun.', 'sedang', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(8, 'banana_sigatoka', 'Sigatoka (Bercak Daun) Pisang', 'Bercak daun Sigatoka menurunkan luas daun efektif dan hasil panen.', 'sedang', NULL, 3, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(9, 'cassava_bacterial_blight', 'Hawar Daun Bakteri (Singkong)', 'Infeksi bakteri penyebab hawar; daun berbercak, mengering, dan mengganggu pertumbuhan.', 'sedang', NULL, 4, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(10, 'cassava_brown_spot', 'Bercak Cokelat (Singkong)', 'Bercak cokelat pada daun singkong; umumnya menurunkan kualitas daun.', 'rendah', NULL, 4, '2025-12-30 11:12:09', '2025-12-30 11:12:09'),
(31, 'cassava_green_mite', 'Serangan Tungau Hijau (Singkong)', 'Serangan tungau hijau pada daun singkong yang menyebabkan daun menguning, keriting, dan pertumbuhan terhambat.', 'sedang', '6953cc3783952.jpg', 4, '2025-12-30 11:20:47', '2025-12-30 12:57:27'),
(32, 'cassava_healthy', 'Daun Singkong Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 4, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(33, 'cassava_mosaic', 'Virus Mosaik Singkong', 'Penyakit virus mosaik pada singkong yang menimbulkan pola mosaik/keriting pada daun dan menurunkan hasil.', 'tinggi', NULL, 4, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(34, 'lettuce_bacterial_spot', 'Bercak Bakteri (Selada)', 'Bercak pada daun selada akibat infeksi bakteri; dapat menyebar saat kelembapan tinggi.', 'sedang', NULL, 7, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(35, 'lettuce_fungal_disease', 'Penyakit Jamur (Selada)', 'Infeksi jamur pada selada yang menyebabkan bercak/nekrosis dan penurunan kualitas daun.', 'sedang', NULL, 7, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(36, 'lettuce_healthy', 'Daun Selada Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 7, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(37, 'maize_fall_armyworm', 'Ulat Grayak (Fall Armyworm) pada Jagung', 'Serangan ulat grayak pada daun jagung; menyebabkan lubang dan kerusakan berat pada pucuk.', 'tinggi', NULL, 8, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(38, 'maize_grasshoper', 'Serangan Belalang pada Jagung', 'Kerusakan daun akibat belalang yang memakan jaringan daun sehingga fotosintesis terganggu.', 'sedang', NULL, 8, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(39, 'maize_healthy', 'Daun Jagung Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 8, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(40, 'maize_leaf_beetle', 'Kumbang Daun pada Jagung', 'Serangan kumbang daun yang menyebabkan daun berlubang/terkoyak dan menurunkan vigor tanaman.', 'sedang', NULL, 8, '2025-12-30 11:20:47', '2025-12-30 11:20:47'),
(41, 'maize_leaf_blight', 'Hawar Daun Jagung', 'Penyakit hawar daun pada jagung yang menyebabkan area daun mengering/mati dan menurunkan hasil.', 'sedang', NULL, 8, '2025-12-30 13:07:48', '2025-12-30 13:07:48'),
(42, 'maize_leaf_spot', 'Bercak Daun Jagung', 'Bercak pada daun jagung akibat patogen; mengurangi luas daun efektif untuk fotosintesis.', 'sedang', NULL, 8, '2025-12-30 13:07:48', '2025-12-30 13:07:48'),
(43, 'maize_streak_virus', 'Virus Streak Jagung', 'Infeksi virus yang menimbulkan garis/loreng (streak) pada daun jagung dan menghambat pertumbuhan.', 'tinggi', NULL, 8, '2025-12-30 13:07:48', '2025-12-30 13:07:48'),
(44, 'pepper_bell_bacterial_spot', 'Bercak Bakteri Paprika', 'Bercak pada daun/buah paprika akibat bakteri; dapat menyebabkan daun rontok dan buah berbintik.', 'sedang', NULL, 9, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(45, 'pepper_bell_healthy', 'Daun Paprika Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 9, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(46, 'tomato_bacterial_spot', 'Bercak Bakteri Tomat', 'Bercak pada daun/buah tomat akibat bakteri; menurunkan kualitas dan dapat menyebabkan gugur daun.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(47, 'tomato_early_blight', 'Busuk Daun Dini (Early Blight) Tomat', 'Penyakit jamur penyebab bercak konsentris pada daun; dapat menyebabkan defoliasi dan penurunan hasil.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(48, 'tomato_healthy', 'Daun Tomat Sehat', 'Tidak terdeteksi gejala penyakit (sehat).', 'rendah', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(49, 'tomato_late_blight', 'Busuk Daun Akhir (Late Blight) Tomat', 'Penyakit serius yang menyebabkan bercak basah, cepat menyebar, dan dapat merusak daun serta buah.', 'tinggi', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(50, 'tomato_leaf_mold', 'Kapang Daun Tomat', 'Infeksi jamur/kapang pada daun tomat, sering muncul pada kelembapan tinggi (bercak kuning & jamur di bawah daun).', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(51, 'tomato_mosaic_virus', 'Virus Mosaik Tomat', 'Infeksi virus yang menimbulkan pola mosaik, daun keriting, dan pertumbuhan tanaman terhambat.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(52, 'tomato_septoria_leaf_spot', 'Bercak Daun Septoria Tomat', 'Bercak kecil gelap pada daun akibat Septoria; dapat menyebabkan daun menguning dan rontok.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(53, 'tomato_spider_mites_two_spotted_spider_mite', 'Serangan Tungau Laba-Laba (Two-spotted) pada Tomat', 'Tungau laba-laba menyebabkan bintik kuning/bronzing dan jaring halus; daun bisa mengering bila parah.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(54, 'tomato_target_spot', 'Bercak Target (Target Spot) Tomat', 'Bercak melingkar/target pada daun dan dapat menyerang buah; menurunkan kualitas dan hasil.', 'sedang', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49'),
(55, 'tomato_yellow_leaf_curl_virus', 'Virus Kuning Keriting Daun Tomat', 'Virus yang menyebabkan daun menguning dan keriting; pertumbuhan kerdil dan hasil turun drastis.', 'tinggi', NULL, 10, '2025-12-30 13:07:49', '2025-12-30 13:07:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diseases`
--
ALTER TABLE `diseases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `diseases_label_unique` (`label`),
  ADD KEY `diseases_plant_type_id_foreign` (`plant_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `diseases`
--
ALTER TABLE `diseases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diseases`
--
ALTER TABLE `diseases`
  ADD CONSTRAINT `diseases_plant_type_id_foreign` FOREIGN KEY (`plant_type_id`) REFERENCES `plant_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
