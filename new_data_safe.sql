-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: farmasi_queue_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `Doctor_Appointments`
--

DROP TABLE IF EXISTS `Doctor_Appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Doctor_Appointments` (
  `NOP` varchar(255) NOT NULL,
  `sep_no` varchar(50) DEFAULT NULL,
  `queue_number` varchar(20) DEFAULT NULL,
  `queue_status` varchar(20) DEFAULT NULL,
  `queue_type` varchar(50) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `medical_record_no` varchar(50) DEFAULT NULL,
  `status_medicine` varchar(255) DEFAULT NULL,
  `patient_date_of_birth` date DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `nik` varchar(255) DEFAULT NULL,
  `doctor_name` varchar(255) DEFAULT NULL,
  `farmasi_queue_number` varchar(20) DEFAULT NULL,
  `PRB` varchar(255) DEFAULT NULL,
  `isPaid` tinyint(1) DEFAULT '0',
  `total_queue` int DEFAULT NULL,
  `poliklinik` varchar(255) DEFAULT NULL,
  `total_medicine` int DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`NOP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Doctor_Appointments`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Doctor_Appointments` WRITE;
/*!40000 ALTER TABLE `Doctor_Appointments` DISABLE KEYS */;
INSERT IGNORE INTO `Doctor_Appointments` VALUES ('NOP/20260121/00010','0901R0130126V007708','NR-226','Menunggu','Dokter-nonracikan','DRS AP WINARTO','00-83-12-88','Non - Racikan','1951-05-14','Lantai 1 BPJS','08561604699','3175031405510003','dr. ALBERT IVAN PARASIAN, Sp.U','NR-226',NULL,0,NULL,NULL,2,NULL),('NOP/20260121/00013','0901R0130126V007711','NR-227','Menunggu','Dokter-nonracikan','KIUK YIN','00-83-31-36','Non - Racikan','1956-08-20','Lantai 1 BPJS','081514706651','3171066008560003','dr. HARIS AKMAN, Sp.PD','NR-227','PRB : Prolanis HT',0,NULL,NULL,4,NULL),('NOP/20260121/00020','0901R0130126V007722','NR-228','Menunggu','Dokter-nonracikan','EKO PRASTIO','00-86-86-52','Non - Racikan','1986-06-14','Lantai 1 BPJS','083872483847','3321021406860001','dr. ALBERT IVAN PARASIAN, Sp.U','NR-228',NULL,0,NULL,NULL,2,NULL),('NOP/20260121/00025','0901R0130126V007727','NR-219','Menunggu','Dokter-nonracikan','CHRISTIANTO, TN.','00-54-73-55','Non - Racikan','1989-05-30','Lantai 1 BPJS','081514706651','3171063005890002','dr. HARIS AKMAN, Sp.PD','NR-219',NULL,0,NULL,NULL,1,NULL),('NOP/20260121/00044','0901R0130126V007749','NR-221','Menunggu','Dokter-nonracikan','IRWAN D.DJAKMAN','00-77-80-92','Non - Racikan','1956-02-27','Lantai 1 BPJS','0817723796','3171062702560001','dr. Ike Adriana, SpJP, Subsp.KI(K), FIHA','NR-221','PRB : Prolanis HT',0,NULL,NULL,5,NULL),('NOP/20260121/00062','0901R0130126V007766','NR-222','Menunggu','Dokter-nonracikan','HERBINA NORA PANGARIBUAN','00-08-04-78','Non - Racikan','1949-04-25','Lantai 1 BPJS','081295223749','3275016504490004','dr. JO CAROLINA MARGARET, Sp.PD','NR-222',NULL,0,NULL,NULL,8,NULL),('NOP/20260121/00069','0901R0130126V007767','NR-220','Menunggu','Dokter-nonracikan','URATNO COVERO SITUMORANG','00-49-11-43','Non - Racikan','1967-03-10','Lantai 1 BPJS','081299340370','3275081003670015','dr. Andika Chandra Putra, PhD, Sp.P(K) Onk, FAPSR','NR-220','Potensi PRB',0,NULL,NULL,2,NULL),('NOP/20260121/00082','0901R0130126V007779','NR-231','Menunggu','Dokter-nonracikan','RINI WIDJAJA','00-83-74-48','Non - Racikan','1974-12-27','Lantai 1 BPJS','087883460736','3171086712740007','dr. Ike Adriana, SpJP, Subsp.KI(K), FIHA','NR-231','PRB : Prolanis DM',0,NULL,NULL,4,NULL),('NOP/20260121/00087','0901R0130126V007783','NR-237','Menunggu','Dokter-nonracikan','MARTRIANA','00-23-36-62','Non - Racikan','1968-03-22','Lantai 1 BPJS','081286413950','3171056203680004','dr. Robert Sinto, Sp.PD-KPTI','NR-237','PRB : Prolanis DM',0,NULL,NULL,24,NULL),('NOP/20260121/00095','0901R0130126V007789','NR-232','Menunggu','Dokter-nonracikan','YUNITA PANJAITAN, S.E.','00-69-30-79','Non - Racikan','1985-06-13','Lantai 1 BPJS','081386695372','3175075306850013','dr. JO CAROLINA MARGARET, Sp.PD','NR-232',NULL,0,NULL,NULL,3,NULL),('NOP/20260121/00096','0901R0130126V007790','NR-238','Menunggu','Dokter-nonracikan','BUDY MULIJANA .D.L','00-62-92-11','Non - Racikan','1945-03-19','Lantai 1 BPJS','081511201019','3171041903450001','dr. Robert Sinto, Sp.PD-KPTI','NR-238','PRB : Prolanis DM, Prolanis HT',0,NULL,NULL,5,NULL),('NOP/20260121/00097','0901R0130126V007793','NR-216','Menunggu','Dokter-nonracikan','STEFANUS SANTA WALUYO','00-10-67-20','Non - Racikan','1966-05-20','Lantai 1 BPJS','087888990834','3275022005660009','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-216','PRB : Prolanis DM',0,NULL,NULL,2,NULL),('NOP/20260121/00099','0901R0130126V007794','NR-223','Menunggu','Dokter-nonracikan','MANGUMBANG SIMAMORA,SH','00-61-61-48','Non - Racikan','1951-02-24','Lantai 1 BPJS','081381012550','3175072402510003','dr. Emon Winardi Danudirgo, Sp.PD, FINASIM','NR-223','PRB : Prolanis DM, Prolanis HT',0,NULL,NULL,9,NULL),('NOP/20260121/00108','0901R0130126V007802','NR-224','Menunggu','Dokter-nonracikan','RUBIYAH','00-08-77-82','Non - Racikan','1951-01-03','Lantai 1 BPJS','08567163844','3174014301510001','dr. Andika Chandra Putra, PhD, Sp.P(K) Onk, FAPSR','NR-224','PRB : JT',0,NULL,NULL,1,NULL),('NOP/20260121/00110','0901R0130126V007807','NR-217','Menunggu','Dokter-nonracikan','NURLIANA TAMBUNAN','00-12-01-32','Non - Racikan','1955-06-14','Lantai 1 BPJS','085882052649','3171055406550002','dr. HARIS AKMAN, Sp.PD','NR-217',NULL,0,NULL,NULL,4,NULL),('NOP/20260121/00113','0901R0130126V007809','NR-218','Menunggu','Dokter-nonracikan','HARSOJO','00-26-65-42','Non - Racikan','1960-12-27','Lantai 1 BPJS','08161392150','3171042712600004','dr. JO CAROLINA MARGARET, Sp.PD','NR-218','PRB : Prolanis DM',0,NULL,NULL,5,NULL),('NOP/20260121/00116','0901R0130126V007814','NR-230','Menunggu','Dokter-nonracikan','ARMINATI','00-83-85-28','Non - Racikan','1966-10-26','Lantai 1 BPJS','083895608677','3203076610660001','dr. Enita Tiur Rohana, Sp.KJ','NR-230',NULL,0,NULL,NULL,3,NULL),('NOP/20260121/00118','0901R0130126V007815','NR-239','Menunggu','Dokter-nonracikan','LUH ANDALINA','00-86-85-07','Non - Racikan','1972-09-22','Lantai 1 BPJS','08159757648','3171026209720007','dr. JO CAROLINA MARGARET, Sp.PD','NR-239','PRB : Prolanis DM, Prolanis HT',0,NULL,NULL,5,NULL),('NOP/20260121/00130','0901R0130126V007826','NR-235','Menunggu','Dokter-nonracikan','PAULINA PLAWING SRI D','00-78-88-18','Non - Racikan','1965-04-25','Lantai 1 BPJS','0811992690','3173076504650001','dr. FRANSISKA, Sp.PD., KGH','NR-235',NULL,0,NULL,NULL,3,NULL),('NOP/20260121/00135','0901R0130126V007830','RC-001','Menunggu','Dokter-racikan','GATOT SUDJOKO WAHJU WIDODO','00-74-31-37','Racikan','1965-06-07','Lantai 1 BPJS','08112900965','3374020706650004','dr. Andika Chandra Putra, PhD, Sp.P(K) Onk, FAPSR','RC-001',NULL,0,NULL,NULL,4,NULL),('NOP/20260121/00136','0901R0130126V007831','NR-233','Menunggu','Dokter-nonracikan','THEN FUK LOY','00-02-65-46','Non - Racikan','1962-11-05','Lantai 1 BPJS','081283683507','3175070511620006','dr. Ike Adriana, SpJP, Subsp.KI(K), FIHA','NR-233',NULL,0,NULL,NULL,3,NULL),('NOP/20260121/00138','0901R0130126V007832','NR-241','Menunggu','Dokter-nonracikan','TJEE HONG GIE','00-41-66-51','Non - Racikan','1963-11-30','Lantai 1 BPJS','081311117536','3173033011630007','dr. Robert Sinto, Sp.PD-KPTI','NR-241','PRB : Prolanis DM',0,NULL,NULL,18,NULL),('NOP/20260121/00157','0901R0130126V007849','NR-225','Menunggu','Dokter-nonracikan','GERALD HALOMOAN SAMOSIR','00-73-63-79','Non - Racikan','1995-06-22','Lantai 1 BPJS','081572936079','1217082206950001','dr. Enita Tiur Rohana, Sp.KJ','NR-225','PRB : SC',0,NULL,NULL,2,NULL),('NOP/20260121/00192','0901R0130126V007873','NR-234','Menunggu','Dokter-nonracikan','MUDJIATI','00-00-40-41','Non - Racikan','1948-12-27','Lantai 1 BPJS','081287095166','3175026712481001','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-234',NULL,0,NULL,NULL,2,NULL),('NOP/20260121/00204','0901R0130126V007881','NR-236','Menunggu','Dokter-nonracikan','RITAWATI ROSALIA WALANDAU','00-83-49-96','Non - Racikan','1962-09-02','Lantai 1 BPJS','08999899705','3175034209620002','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-236','PRB : JT, Prolanis HT',0,NULL,NULL,3,NULL),('NOP/20260121/00225','0901R0130126V007892','NR-240','Menunggu','Dokter-nonracikan','SIMON MALAU, SH','00-28-95-04','Non - Racikan','1950-12-17','Lantai 1 BPJS','081282722951','3175011712500002','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-240',NULL,0,NULL,NULL,2,NULL);
/*!40000 ALTER TABLE `Doctor_Appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Verification_Task`
--

DROP TABLE IF EXISTS `Verification_Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Verification_Task` (
  `NOP` varchar(255) NOT NULL,
  `Executor` varchar(50) DEFAULT NULL,
  `Executor_Names` varchar(150) DEFAULT NULL,
  `waiting_verification_stamp` timestamp NULL DEFAULT NULL,
  `called_verification_stamp` timestamp NULL DEFAULT NULL,
  `recalled_verification_stamp` timestamp NULL DEFAULT NULL,
  `pending_verification_stamp` timestamp NULL DEFAULT NULL,
  `processed_verification_stamp` timestamp NULL DEFAULT NULL,
  `completed_verification_stamp` timestamp NULL DEFAULT NULL,
  `loket` varchar(50) DEFAULT NULL,
  `lokasi` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`NOP`),
  CONSTRAINT `Verification_Task_ibfk_1` FOREIGN KEY (`NOP`) REFERENCES `Pharmacy_Task` (`NOP`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Verification_Task`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Verification_Task` WRITE;
/*!40000 ALTER TABLE `Verification_Task` DISABLE KEYS */;
INSERT IGNORE INTO `Verification_Task` VALUES ('NOP/20260121/00010',NULL,NULL,'2026-01-21 09:38:47',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00013',NULL,NULL,'2026-01-21 09:38:55',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00020',NULL,NULL,'2026-01-21 09:38:59',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00025',NULL,NULL,'2026-01-21 09:38:15',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00044',NULL,NULL,'2026-01-21 09:38:24',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00062',NULL,NULL,'2026-01-21 09:38:29',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00069',NULL,NULL,'2026-01-21 09:38:20',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00082',NULL,NULL,'2026-01-21 09:41:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00087',NULL,NULL,'2026-01-21 09:55:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00095',NULL,NULL,'2026-01-21 09:44:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00096',NULL,NULL,'2026-01-21 09:57:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00097',NULL,NULL,'2026-01-21 09:38:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00099',NULL,NULL,'2026-01-21 09:38:33',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00108',NULL,NULL,'2026-01-21 09:38:37',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00110',NULL,NULL,'2026-01-21 09:38:06',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00113',NULL,NULL,'2026-01-21 09:38:10',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00116',NULL,NULL,'2026-01-21 09:39:02',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00118',NULL,NULL,'2026-01-21 09:59:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00130',NULL,NULL,'2026-01-21 09:46:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00135',NULL,NULL,'2026-01-21 09:43:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00136',NULL,NULL,'2026-01-21 09:45:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00138',NULL,NULL,'2026-01-21 10:03:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00157',NULL,NULL,'2026-01-21 09:38:42',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00192',NULL,NULL,'2026-01-21 09:45:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00204',NULL,NULL,'2026-01-21 09:46:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00225',NULL,NULL,'2026-01-21 10:02:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS');
/*!40000 ALTER TABLE `Verification_Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pharmacy_Task`
--

DROP TABLE IF EXISTS `Pharmacy_Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pharmacy_Task` (
  `NOP` varchar(255) NOT NULL,
  `lokasi` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `medicine_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`NOP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pharmacy_Task`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Pharmacy_Task` WRITE;
/*!40000 ALTER TABLE `Pharmacy_Task` DISABLE KEYS */;
INSERT IGNORE INTO `Pharmacy_Task` VALUES ('NOP/20260121/00010','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00013','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00020','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00025','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00044','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00062','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00069','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00082','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00087','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00095','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00096','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00097','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00099','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00108','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00110','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00113','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00116','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00118','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00130','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00135','Lantai 1 BPJS','waiting_verification','Racikan'),('NOP/20260121/00136','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00138','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00157','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00192','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00204','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00225','Lantai 1 BPJS','waiting_verification','Non - Racikan');
/*!40000 ALTER TABLE `Pharmacy_Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Medicine_Task`
--

DROP TABLE IF EXISTS `Medicine_Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Medicine_Task` (
  `NOP` varchar(255) NOT NULL,
  `Executor` varchar(50) DEFAULT NULL,
  `Executor_Names` varchar(150) DEFAULT NULL,
  `waiting_medicine_stamp` timestamp NULL DEFAULT NULL,
  `called_medicine_stamp` timestamp NULL DEFAULT NULL,
  `recalled_medicine_stamp` timestamp NULL DEFAULT NULL,
  `pending_medicine_stamp` timestamp NULL DEFAULT NULL,
  `processed_medicine_stamp` timestamp NULL DEFAULT NULL,
  `completed_medicine_stamp` timestamp NULL DEFAULT NULL,
  `loket` varchar(50) DEFAULT NULL,
  `lokasi` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`NOP`),
  CONSTRAINT `Medicine_Task_ibfk_1` FOREIGN KEY (`NOP`) REFERENCES `Pharmacy_Task` (`NOP`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Medicine_Task`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Medicine_Task` WRITE;
/*!40000 ALTER TABLE `Medicine_Task` DISABLE KEYS */;
/*!40000 ALTER TABLE `Medicine_Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pickup_Task`
--

DROP TABLE IF EXISTS `Pickup_Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pickup_Task` (
  `NOP` varchar(255) NOT NULL,
  `Executor` varchar(50) DEFAULT NULL,
  `Executor_Names` varchar(150) DEFAULT NULL,
  `waiting_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `called_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `recalled_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `pending_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `processed_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `completed_pickup_medicine_stamp` timestamp NULL DEFAULT NULL,
  `loket` varchar(50) DEFAULT NULL,
  `lokasi` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`NOP`),
  CONSTRAINT `Pickup_Task_ibfk_1` FOREIGN KEY (`NOP`) REFERENCES `Pharmacy_Task` (`NOP`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pickup_Task`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Pickup_Task` WRITE;
/*!40000 ALTER TABLE `Pickup_Task` DISABLE KEYS */;
/*!40000 ALTER TABLE `Pickup_Task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21  3:03:25
