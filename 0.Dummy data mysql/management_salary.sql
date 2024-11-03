-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Nov 2024 pada 02.20
-- Versi server: 8.0.34
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `management_salary`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `attendance_data`
--

CREATE TABLE `attendance_data` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('OVERTIME','PERMIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `attendance_data`
--

INSERT INTO `attendance_data` (`id`, `employee_id`, `type`, `date`, `createdAt`, `updatedAt`) VALUES
('02c3b458-cbec-4ab0-872a-85f73f4bda1b', '128e9775-d073-44ba-ac9a-c09c78b41f94', 'OVERTIME', '2024-10-16 00:00:00.000', '2024-11-02 15:19:23.988', '2024-11-02 15:19:23.988'),
('0affcc09-e596-4b43-bf1b-63562ebbdf7f', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-09-19 00:00:00.000', '2024-11-02 04:18:14.852', '2024-11-02 11:29:10.301'),
('2eb687da-4b4b-4390-9b21-cc3baad9c191', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-28 00:00:00.000', '2024-11-02 04:36:58.348', '2024-11-02 22:54:51.527'),
('39152d4d-5c13-4792-9c10-b9f9f8e55f44', '6a7144f5-743a-4a82-a2c1-3455a2a510dd', 'OVERTIME', '2024-11-01 00:00:00.000', '2024-11-03 01:10:05.500', '2024-11-03 01:10:05.500'),
('55c126f0-fc30-479c-8340-97fe683d77b4', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-02 00:00:00.000', '2024-11-02 04:09:10.577', '2024-11-02 22:54:29.524'),
('565a300b-7c53-4b27-850d-a8cd72469efb', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-06-11 00:00:00.000', '2024-11-02 03:30:03.629', '2024-11-02 11:21:45.236'),
('68dda823-07b3-442d-8f88-404d2eac3fad', 'd061ca34-cd37-44e6-956b-250f469a21be', 'PERMIT', '2024-06-06 00:00:00.000', '2024-11-02 03:24:51.168', '2024-11-02 03:24:51.168'),
('7b3c2175-4353-4aee-a558-1cd14653c509', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-02 00:00:00.000', '2024-11-03 00:10:39.884', '2024-11-03 00:10:39.884'),
('7d748bce-5c56-4a84-a9f2-cb9d005032ab', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-25 00:00:00.000', '2024-11-02 04:37:06.477', '2024-11-02 22:54:46.017'),
('a1120735-4e79-4c6d-8e04-8fd76a774512', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-10-24 00:00:00.000', '2024-11-02 04:09:06.230', '2024-11-02 11:27:32.571'),
('b37c4729-c1c4-4781-b5a4-52c141230ad8', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-22 00:00:00.000', '2024-11-02 04:09:15.462', '2024-11-02 11:28:57.963'),
('c7b3266b-070d-432f-be36-0f8938f23bf9', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-11-01 00:00:00.000', '2024-11-02 04:38:38.272', '2024-11-02 22:54:34.467'),
('c92ccaed-5a48-4d9f-8636-42d728b32c7d', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-07-17 00:00:00.000', '2024-11-02 11:21:56.452', '2024-11-02 11:21:56.452'),
('ca0adc2f-ddf8-4f28-a6ed-a38496398232', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-06-06 00:00:00.000', '2024-11-02 03:30:00.457', '2024-11-02 03:30:00.457'),
('d93fd485-b396-49dc-ba2d-d9567eb203e7', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-26 00:00:00.000', '2024-11-02 04:09:58.571', '2024-11-02 22:53:32.436'),
('e8a5d814-3223-4a71-b117-fd7e81751bbe', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-10-25 00:00:00.000', '2024-11-02 04:09:21.993', '2024-11-02 22:53:39.892'),
('f4be438f-1511-4822-ba63-504c0a0dc08e', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-23 00:00:00.000', '2024-11-02 04:09:52.547', '2024-11-02 11:27:10.613'),
('f93cb40f-fed9-4fe8-abf6-3bdc67b123c9', '0f8aaa30-49a9-444d-9028-a9093f671933', 'OVERTIME', '2024-10-27 00:00:00.000', '2024-11-02 04:40:22.083', '2024-11-02 22:54:38.929'),
('fc20adaf-9a11-4746-9a3c-b055b48bc744', '0f8aaa30-49a9-444d-9028-a9093f671933', 'PERMIT', '2024-10-16 00:00:00.000', '2024-11-02 05:00:57.929', '2024-11-02 11:27:18.284');

-- --------------------------------------------------------

--
-- Struktur dari tabel `employee`
--

CREATE TABLE `employee` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member` int NOT NULL,
  `first_enter` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `employee`
--

INSERT INTO `employee` (`id`, `name`, `member`, `first_enter`, `createdAt`, `updatedAt`) VALUES
('0f8aaa30-49a9-444d-9028-a9093f671933', 'Ruhulk Azom Pratama', 112, '2024-06-06 00:00:00.000', '2024-11-01 09:52:03.103', '2024-11-03 01:19:32.490'),
('128e9775-d073-44ba-ac9a-c09c78b41f94', 'Mahardika Muhammad', 132, '2024-07-18 00:00:00.000', '2024-11-01 23:02:20.855', '2024-11-03 00:46:48.216'),
('3da20c23-2922-45ed-960f-fd0a1f65b881', 'Putri Bataloka', 115, '2024-07-18 00:00:00.000', '2024-11-01 23:19:33.002', '2024-11-03 00:46:39.026'),
('40d6dc6f-699c-4a58-8629-86a1009cc095', 'Naruto ', 30, '2024-08-07 00:00:00.000', '2024-11-01 10:10:29.555', '2024-11-03 00:46:30.812'),
('42d04364-40cb-4fc7-8534-dec2565829cb', 'Sasuke', 67, '2024-09-18 00:00:00.000', '2024-11-01 23:20:13.755', '2024-11-03 00:46:24.163'),
('6221f9c8-8f27-4fdb-9089-3a37ef2ee7bb', 'Dion Pratama', 6, '2024-09-26 00:00:00.000', '2024-11-01 23:20:22.052', '2024-11-03 00:46:17.918'),
('6a7144f5-743a-4a82-a2c1-3455a2a510dd', 'Aini Fitri', 54, '2024-09-25 00:00:00.000', '2024-11-02 00:45:50.068', '2024-11-03 00:46:11.777'),
('955c5d1f-ed22-4729-9e41-aa01f486ab9d', 'Zainul', 49, '2024-08-02 00:00:00.000', '2024-11-01 23:23:20.319', '2024-11-03 00:46:02.753'),
('d061ca34-cd37-44e6-956b-250f469a21be', 'Elon Musk', 21, '2024-08-20 00:00:00.000', '2024-11-01 23:20:06.818', '2024-11-03 00:45:47.773');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','USER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('cda1d6d4-e9b8-4fcb-9077-d086c2100ce1', 'admin@gmail.com', 'Admin', '$2a$10$YA7dFBAqXPzgvP1nDHBhlOzJLQOTm1gk03yUKcF04cOLTjtVVApMS', 'USER', '2024-11-01 08:36:57.321', '2024-11-01 08:36:57.321'),
('efb2037f-38c1-4a84-ac57-16a59a16f92c', 'awdawdawd', 'awdwadaw', '$2a$10$YV6LFm2fxTJBJ/AD0xoh6.O1Xc8COC0BNycfu9g7Cr8ehTSMJlCcm', 'USER', '2024-11-01 08:16:22.798', '2024-11-01 08:16:22.798');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `attendance_data`
--
ALTER TABLE `attendance_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Attendance_Data_employee_id_fkey` (`employee_id`);

--
-- Indeks untuk tabel `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `attendance_data`
--
ALTER TABLE `attendance_data`
  ADD CONSTRAINT `Attendance_Data_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
