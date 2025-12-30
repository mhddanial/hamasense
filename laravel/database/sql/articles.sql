-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 30, 2025 at 01:53 PM
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
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `published_at` timestamp NULL DEFAULT NULL,
  `views_count` int NOT NULL DEFAULT '0',
  `estimated_read_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `references` json DEFAULT NULL,
  `writer_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `image`, `img_path`, `tags`, `summary`, `published_at`, `views_count`, `estimated_read_time`, `content`, `references`, `writer_id`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Mulai Urban Farming dari Pot (Panduan Cepat untuk Pemula)', 'mulai-urban-farming-dari-pot-panduan-cepat-untuk-pemula-6953d62e2fb36', '/storage/articles/myIJtPLxME6AYGoj8Rx9nTBqRmtcZDvkSnf0slTv.png', NULL, NULL, NULL, NULL, 0, NULL, '<h2 class=\"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0\"><span style=\"white-space: pre-wrap;\">Punya balkon kecil, teras sempit, atau cuma jendela yang kena cahaya? Itu sudah cukup buat mulai </span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">urban farming.</em></i></h2><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Mulai dari </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">pilih tanaman yang “ramah pemula”</strong></b><span style=\"white-space: pre-wrap;\">: sayur daun (pakcoy, selada, bayam), herba (kemangi, mint), atau cabai rawit kalau sudah agak pede. Lalu pastikan </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">wadah tanam punya lubang drainase</strong></b><span style=\"white-space: pre-wrap;\">—tanaman sering gagal bukan karena kurang pupuk, tapi karena akar “tenggelam” dan busuk.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Untuk media tanam, gunakan </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">campuran yang gembur dan cepat mengalirkan air</strong></b><span style=\"white-space: pre-wrap;\">. Hindari tanah kebun yang terlalu padat jika ditaruh di pot, karena gampang becek dan bikin akar sulit bernapas. Setelah itu, atur </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">rutinitas siram yang konsisten</strong></b><span style=\"white-space: pre-wrap;\">: cek media dengan jari—kalau bagian atas terasa kering, baru siram sampai air menetes dari bawah pot.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Supaya tanaman cepat tumbuh, beri </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">nutrisi ringan tapi rutin</strong></b><span style=\"white-space: pre-wrap;\"> (sesuai jenis tanaman dan media). Dan jangan lupa, cahaya itu “makanan” utama: tempatkan tanaman di area yang paling terang yang kamu punya.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Terakhir, biasakan </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">cek daun 1 menit setiap hari</strong></b><span style=\"white-space: pre-wrap;\">. Kalau ada bercak, daun mengeriting, atau bintik-bintik kecil, segera lakukan tindakan ringan (pangkas daun bermasalah, bersihkan, atau isolasi pot). Di aplikasi ini, kamu juga bisa </span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">scan</strong></b><span style=\"white-space: pre-wrap;\"> untuk bantu mengenali kemungkinan masalah lebih cepat—biar kebun kecilmu tetap produktif dan menyenangkan.</span></p>', '[{\"url\": \"https://www.rhs.org.uk/container-gardening\", \"source_name\": \"Sumber 1\"}, {\"url\": \"https://extension.umd.edu/resource/growing-vegetables-containers/\", \"source_name\": \"Sumber 2\"}]', 1, 3, '2025-12-30 13:39:58', '2025-12-30 13:41:58'),
(2, 'Sempit Bukan Halangan: 5 Trik Rahasia Panen Melimpah di Lahan Terbatas', 'sempit-bukan-halangan-5-trik-rahasia-panen-melimpah-di-lahan-terbatas-6953d7840e941', '/storage/articles/U0lWqizzKyBWLWV7jgIazh2jZ5GwqNV8teck2bLv.png', NULL, NULL, NULL, NULL, 0, NULL, '<p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Memulai </span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">urban farming</em></i><span style=\"white-space: pre-wrap;\"> atau sekadar hobi mengoleksi tanaman hias di rumah seringkali terasa menantang, terutama jika Anda hanya memiliki balkon kecil atau teras yang terbatas. Namun, keterbatasan lahan bukanlah alasan untuk berhenti menanam. Dengan teknik yang tepat, Anda bisa mengubah sudut rumah menjadi oase hijau yang produktif.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Berikut adalah beberapa tips esensial agar tanaman Anda tetap subur dan estetik:</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Pilih Jenis Tanaman yang Tepat:</strong></b><span style=\"white-space: pre-wrap;\"> Bagi pemula, mulailah dengan tanaman \"tahan banting\" seperti bayam, kangkung, atau tanaman herbal seperti mint dan kemangi.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Maksimalkan Ruang Vertikal:</strong></b><span style=\"white-space: pre-wrap;\"> Gunakan rak dinding atau pot gantung. Teknik vertikultur ini sangat efektif untuk menghemat ruang sekaligus mempercantik dekorasi rumah.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Perhatikan Drainase:</strong></b><span style=\"white-space: pre-wrap;\"> Pastikan pot memiliki lubang air yang cukup. Kesalahan umum pemula adalah menyiram terlalu banyak tanpa sistem pembuangan air yang baik, yang justru memicu pembusukan akar.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Manfaatkan Cahaya Matahari:</strong></b><span style=\"white-space: pre-wrap;\"> Letakkan tanaman di area yang terkena sinar matahari minimal 4–6 jam sehari. Jika ruangan terlalu gelap, pertimbangkan penggunaan </span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">grow light</em></i><span style=\"white-space: pre-wrap;\">.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Konsistensi adalah Kunci:</strong></b><span style=\"white-space: pre-wrap;\"> Tanaman adalah makhluk hidup yang butuh perhatian. Cek kelembapan tanah secara rutin dengan jari Anda sebelum memutuskan untuk menyiram.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Siap mengubah rumah Anda menjadi lebih asri? Mari bergabung dengan komunitas kami di aplikasi ini untuk mendapatkan panduan harian, jadwal pemupukan otomatis, dan berbagi pengalaman dengan sesama penghobi tanaman!</span></p>', NULL, 1, 2, '2025-12-30 13:45:40', '2025-12-30 13:45:40'),
(3, 'Jangan Tunggu Layu! Tips Anti-Gagal Jaga Tanaman Tetap Happy', 'jangan-tunggu-layu-tips-anti-gagal-jaga-tanaman-tetap-happy-6953d8e42de31', '/storage/articles/uOXHFIG4J1NQfUqo9Z1p1rxdaUyLsTrcLjfHjEOr.jpg', NULL, NULL, NULL, NULL, 0, NULL, '<p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Jujur deh, lebih gampang mencegah tanaman sakit daripada nyelamatin yang sudah sekarat, kan? Buat kamu yang baru mulai </span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">urban farming</em></i><span style=\"white-space: pre-wrap;\">, nggak perlu panik kalau belum punya \"tangan dingin\". Kuncinya cuma satu: waspada sejak dini.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Berikut cara simpel biar tanaman kamu nggak gampang stres atau kena hama:</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Aturan 2 Centimeter:</strong></b><span style=\"white-space: pre-wrap;\"> Jangan asal siram! Tusuk tanah pakai jari, kalau sedalam 2 cm masih terasa lembap, jangan disiram. Ini cara paling ampuh cegah akar busuk akibat </span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">overwatering</em></i><span style=\"white-space: pre-wrap;\">.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Intip Bawah Daun:</strong></b><span style=\"white-space: pre-wrap;\"> Hama itu suka main petak umpet. Biasakan cek bagian bawah daun seminggu sekali. Kalau ada bintik putih atau lengket, segera bersihkan sebelum mereka \"pesta pora\" ke tanaman lain.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Kasih Jarak (Social Distancing):</strong></b><span style=\"white-space: pre-wrap;\"> Jangan taruh pot terlalu rapat. Sirkulasi udara yang lancar bakal mencegah jamur berkembang biak di area lembap sekitar daun.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Karantina Tanaman Baru:</strong></b><span style=\"white-space: pre-wrap;\"> Kalau baru beli tanaman dari pasar, jangan langsung dicampur sama koleksi lama. Pisahkan dulu selama seminggu buat memastikan dia nggak bawa \"penumpang gelap\" alias kutu.</span></p><p class=\"leading-7 [&amp;:not(:first-child)]:mt-6\"><span style=\"white-space: pre-wrap;\">Mau lebih tenang? Pantau kesehatan tanamanmu lewat aplikasi ini! Kamu bakal dapet notifikasi jadwal perawatan dan deteksi dini masalah tanaman cuma lewat foto. Yuk, bikin kebun mungilmu bebas drama!</span></p>', NULL, 1, 5, '2025-12-30 13:51:32', '2025-12-30 13:51:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_slug_unique` (`slug`),
  ADD KEY `articles_writer_id_foreign` (`writer_id`),
  ADD KEY `articles_category_id_foreign` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`),
  ADD CONSTRAINT `articles_writer_id_foreign` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
