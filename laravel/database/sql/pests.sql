-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: hamasense
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pests`
--

DROP TABLE IF EXISTS `pests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scientific_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `img_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Serangga',
  `risk_level` enum('rendah','sedang','tinggi') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sedang',
  `plant` json DEFAULT NULL,
  `pencegahan` json DEFAULT NULL,
  `penanganan` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pests_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pests`
--

LOCK TABLES `pests` WRITE;
/*!40000 ALTER TABLE `pests` DISABLE KEYS */;
INSERT INTO `pests` VALUES (1,'Ulat Grayak Jagung (Fall Armyworm)','ulat-grayak-jagung-fall-armyworm','Spodoptera frugiperda','Larva memakan daun dan pucuk jagung, sering meninggalkan lubang tidak beraturan dan kotoran (frass) di whorl. Serangan berat menurunkan hasil secara signifikan.','6954d6fe85c3d.jpg','Serangga','tinggi','[\"Jagung\"]','[\"Tanam serempak untuk memutus siklus hama\", \"Monitoring rutin pada fase vegetatif awal\", \"Bersihkan gulma di sekitar lahan\"]','[\"Ambil dan musnahkan larva bila populasi rendah\", \"Gunakan perangkap feromon untuk monitoring\", \"Aplikasikan insektisida sesuai anjuran bila ambang kendali terlampaui\"]','2025-12-31 07:53:35','2025-12-31 07:55:42'),(2,'Kutu Daun (Aphid)','kutu-daun-aphid','Aphis gossypii','Mengisap cairan daun muda, menyebabkan daun keriting dan pertumbuhan terhambat. Dapat menghasilkan embun madu yang memicu jelaga serta berperan sebagai vektor virus.','6954d7224af95.jpeg','Serangga','sedang','[\"Tomat\", \"Paprika\", \"Selada\"]','[\"Gunakan mulsa perak untuk mengurangi kedatangan vektor\", \"Jaga kebersihan kebun dan kendalikan gulma\", \"Tanam tanaman refugia untuk musuh alami\"]','[\"Semprot air bertekanan untuk menurunkan populasi\", \"Gunakan sabun insektisida/ minyak nabati\", \"Insektisida selektif bila serangan tinggi\"]','2025-12-31 07:53:35','2025-12-31 07:56:18'),(3,'Thrips','thrips','Frankliniella occidentalis','Menyerang daun dan bunga, menimbulkan bercak keperakan dan deformasi. Pada beberapa tanaman dapat menjadi vektor virus.','6954d75dbb778.webp','Serangga','sedang','[\"Tomat\", \"Paprika\", \"Selada\"]','[\"Pasang perangkap lengket biru/kuning untuk monitoring\", \"Kurangi gulma inang di sekitar lahan\", \"Atur sirkulasi udara dan kelembapan\"]','[\"Sanitasi bagian tanaman yang terserang\", \"Gunakan agen hayati sesuai ketersediaan\", \"Rotasi insektisida untuk mencegah resistensi\"]','2025-12-31 07:53:35','2025-12-31 07:57:17'),(4,'Lalat Buah','lalat-buah','Bactrocera dorsalis','Betina meletakkan telur pada buah, larva merusak daging buah dan menyebabkan busuk. Serangan meningkat saat buah mulai matang.','6954d785a1727.webp','Serangga','tinggi','[\"Tomat\", \"Paprika\"]','[\"Sanitasi: kumpulkan dan musnahkan buah jatuh/terserang\", \"Gunakan pembungkusan buah bila memungkinkan\", \"Pasang perangkap metil eugenol/atraktan\"]','[\"Perangkap massal untuk menekan populasi\", \"Pemangkasan dan sanitasi rutin\", \"Aplikasi umpan protein + insektisida sesuai anjuran\"]','2025-12-31 07:53:35','2025-12-31 07:57:57'),(5,'Kumbang Daun Jagung','kumbang-daun-jagung','Diabrotica virgifera','Kumbang dan larvanya dapat merusak daun/akar. Gejala umum berupa daun berlubang dan tanaman melemah.','6954d7cf7cc4f.webp','Serangga','sedang','[\"Jagung\"]','[\"Rotasi tanaman untuk memutus siklus\", \"Pengolahan tanah untuk mengganggu pupa/larva\", \"Monitoring populasi di awal musim\"]','[\"Pengendalian mekanis pada serangan ringan\", \"Gunakan insektisida bila diperlukan sesuai ambang kendali\", \"Perbaiki kesehatan tanah untuk meningkatkan vigor tanaman\"]','2025-12-31 07:53:35','2025-12-31 07:59:11'),(6,'Tungau Laba-laba (Two-spotted Spider Mite)','tungau-laba-laba-two-spotted','Tetranychus urticae','Menimbulkan bintik kuning pada daun, daun mengering, dan sering terlihat jaring halus. Populasi cepat naik saat cuaca panas dan kering.','6954d88983473.jpg','Tungau','sedang','[\"Tomat\", \"Paprika\", \"Selada\"]','[\"Jaga kelembapan optimal (tidak terlalu kering)\", \"Hindari penggunaan insektisida broad-spectrum berlebihan\", \"Monitoring bagian bawah daun\"]','[\"Semprot air untuk menurunkan populasi\", \"Akarisida sesuai anjuran bila parah\", \"Buang daun yang terserang berat\"]','2025-12-31 07:53:35','2025-12-31 08:02:17'),(7,'Tungau Hijau Singkong','tungau-hijau-singkong','Mononychellus tanajoa','Mengisap cairan daun singkong, menyebabkan daun menguning, keriting, dan pertumbuhan terhambat terutama pada musim kering.','6954d8c0c7a9f.jpg','Tungau','sedang','[\"Singkong\"]','[\"Gunakan varietas toleran bila tersedia\", \"Jaga kelembapan dan kurangi stres tanaman\", \"Monitoring daun muda\"]','[\"Pemangkasan bagian terserang berat\", \"Akarisida sesuai anjuran bila populasi tinggi\", \"Perbaiki nutrisi tanaman\"]','2025-12-31 07:53:35','2025-12-31 08:03:12'),(8,'Nematoda Puru Akar','nematoda-puru-akar','Meloidogyne incognita','Menyerang akar dan membentuk puru/bengkak, sehingga penyerapan air dan hara terganggu. Tanaman menjadi kerdil dan mudah layu.','6954d90499beb.jpg','Nematoda','tinggi','[\"Tomat\", \"Paprika\"]','[\"Rotasi tanaman non-inang\", \"Gunakan bibit sehat dan media tanam steril\", \"Aplikasikan bahan organik untuk memperbaiki tanah\"]','[\"Solarisasi tanah bila memungkinkan\", \"Gunakan agen hayati/nematisida sesuai rekomendasi\", \"Cabut tanaman yang sangat parah\"]','2025-12-31 07:53:35','2025-12-31 08:04:20'),(9,'Siput/Bekicot','siput-bekicot','Achatina fulica','Memakan daun muda pada malam hari, meninggalkan bekas gigitan dan lendir. Umum menyerang area lembap dan kebun yang rimbun.','6954d97a36f56.jpg','Moluska','sedang','[\"Selada\", \"Tomat\"]','[\"Kurangi tempat lembap/naungan berlebih\", \"Bersihkan gulma dan sisa tanaman\", \"Buat barier (abu/kapur) di sekitar bedengan\"]','[\"Kumpulkan manual pada malam/pagi hari\", \"Gunakan umpan moluskisida sesuai aturan\", \"Pasang perangkap (daun pepaya/bekas papan) untuk monitoring\"]','2025-12-31 07:53:35','2025-12-31 08:06:18'),(10,'Tikus Sawah/Kebun','tikus-sawah-kebun','Rattus argentiventer','Merusak tanaman dengan memakan batang, daun, atau buah. Populasi dapat meningkat cepat bila sanitasi lahan buruk.','6954d9bf1b61b.jpg','Rodentia','tinggi','[\"Jagung\", \"Pisang\", \"Tomat\"]','[\"Sanitasi lahan dan tutup lubang sarang\", \"Pengelolaan habitat (rapikan semak di tepi lahan)\", \"Gunakan perangkap secara rutin\"]','[\"Perangkap mekanis di jalur lintasan\", \"Pengumpanan rodentisida secara hati-hati sesuai regulasi\", \"Koordinasi pengendalian serentak di area sekitar\"]','2025-12-31 07:53:35','2025-12-31 08:07:27');
/*!40000 ALTER TABLE `pests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pest_categories`
--

DROP TABLE IF EXISTS `pest_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pest_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pest_categories`
--

LOCK TABLES `pest_categories` WRITE;
/*!40000 ALTER TABLE `pest_categories` DISABLE KEYS */;
INSERT INTO `pest_categories` VALUES (1,'Serangga','2025-12-31 07:53:35','2025-12-31 07:53:35'),(2,'Tungau','2025-12-31 07:53:35','2025-12-31 07:53:35'),(3,'Nematoda','2025-12-31 07:53:35','2025-12-31 07:53:35'),(4,'Moluska','2025-12-31 07:53:35','2025-12-31 07:53:35'),(5,'Rodentia','2025-12-31 07:53:35','2025-12-31 07:53:35');
/*!40000 ALTER TABLE `pest_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-31 15:42:38
