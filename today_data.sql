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
-- WHERE:  DATE(created_at) = CURDATE()

