-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 30, 2025 at 01:36 PM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `avatar` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','customer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `google_id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `avatar`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, 'admin', 'admin1@hamasense.tech', '2025-12-30 09:21:54', '$2y$12$rLv1SOeWQIUKvRHQS41PWunCCN2lktUFc3MT0S4nFfc/ZLhtlMPA2', NULL, NULL, NULL, NULL, 'admin', NULL, '2025-12-30 09:21:54', '2025-12-30 09:21:54'),
(2, '112754075208818253306', 'Muhammad Danial', 'mhd2danial3@gmail.com', '2025-12-30 09:38:47', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKLyQ8QIeLHLB9a2jY6HNrVuzx2-zjD_xDVFutRa96haxap-w=s96-c', 'customer', 'Lv27xlGP9ZB4wNEUYOi8fZAUFp9NfNGlNpdKy0btaKgdWIf1TKLqIiDDCYlE', '2025-12-30 09:38:47', '2025-12-30 09:38:47'),
(3, '106872766269876776674', 'Muhammad Danial', 'danialjoki64@gmail.com', '2025-12-30 10:04:38', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJfhL2_V8-JvAyxtcSr9e8vTF7y0A7egED6tgcqByiqLIiqIeI=s96-c', 'customer', 'LrVunWpiM51zj0iifxfcFkfeh9e4qkSEazC194QjPCCCnHPO32r428F5MfcC', '2025-12-30 10:04:38', '2025-12-30 10:04:38'),
(4, NULL, 'Raka Pratama', 'raka.pratama01@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(5, NULL, 'Siti Aulia', 'siti.aulia02@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(6, NULL, 'Fajar Nugroho', 'fajar.nugroho03@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(7, NULL, 'Nadia Putri', 'nadia.putri04@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(8, NULL, 'Dimas Saputra', 'dimas.saputra05@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(9, NULL, 'Ayu Lestari', 'ayu.lestari06@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(10, NULL, 'Bagas Ramadhan', 'bagas.ramadhan07@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(11, NULL, 'Intan Maharani', 'intan.maharani08@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(12, NULL, 'Rizky Hidayat', 'rizky.hidayat09@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(13, NULL, 'Dewi Anggraini', 'dewi.anggraini10@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(14, NULL, 'Yoga Prabowo', 'yoga.prabowo11@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(15, NULL, 'Naufal Akbar', 'naufal.akbar12@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(16, NULL, 'Putri Salsabila', 'putri.salsabila13@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(17, NULL, 'Reza Maulana', 'reza.maulana14@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(18, NULL, 'Maya Kurnia', 'maya.kurnia15@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(19, NULL, 'Agus Santoso', 'agus.santoso16@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(20, NULL, 'Tasya Permata', 'tasya.permata17@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(21, NULL, 'Hendra Wijaya', 'hendra.wijaya18@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(22, NULL, 'Lia Oktaviani', 'lia.oktaviani19@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58'),
(23, NULL, 'Alvin Saputro', 'alvin.saputro20@hamasense.test', '2025-12-30 13:30:58', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'customer', NULL, '2025-12-30 13:30:58', '2025-12-30 13:30:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_google_id_unique` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
