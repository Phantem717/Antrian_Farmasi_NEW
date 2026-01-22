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
  `total_medicine` int DEFAULT NULL,
  `isPaid` tinyint(1) DEFAULT NULL,
  `total_queue` int DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  `poliklinik` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`NOP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Doctor_Appointments`
--
-- WHERE:  NOP LIKE '%20260121%'

LOCK TABLES `Doctor_Appointments` WRITE;
/*!40000 ALTER TABLE `Doctor_Appointments` DISABLE KEYS */;
INSERT INTO `Doctor_Appointments` VALUES ('NOP/20260121/00008','0901R0130126V007705','NR-005','Menunggu','Dokter-nonracikan','VANDY NOVIANTO LIGOPUTRO','00-47-37-44','Non - Racikan','1961-08-04','Lantai 1 BPJS','08999943042','3171040408610005','dr. FRANSISKA, Sp.PD., KGH','NR-005',NULL,5,NULL,NULL,NULL,NULL),('NOP/20260121/00009','0901R0130126V007706','NR-006','Menunggu','Dokter-nonracikan','SUMURUNG TIGOR SIAHAAN','00-61-82-21','Non - Racikan','1946-02-18','Lantai 1 BPJS','081316010250','3171021802460001','dr. FRANSISKA, Sp.PD., KGH','NR-006',NULL,13,NULL,NULL,NULL,NULL),('NOP/20260121/00011','0901R0130126V007709','NR-007','Menunggu','Dokter-nonracikan','HUSIN ZUBAIDI','00-77-92-85','Non - Racikan','1962-03-15','Lantai 1 BPJS','08128645212','3171011503620006','dr. FRANSISKA, Sp.PD., KGH','NR-007',NULL,8,NULL,NULL,NULL,NULL),('NOP/20260121/00012','0901R0130126V007710','NR-001','Menunggu','Dokter-nonracikan','MUHAMAD YASIN','00-52-11-11','Non - Racikan','1964-05-12','Lantai 1 BPJS','088214693061','3171081205640002','dr. FRANSISKA, Sp.PD., KGH','NR-001',NULL,13,NULL,NULL,NULL,NULL),('NOP/20260121/00014','0901R0130126V007712','NR-003','Menunggu','Dokter-nonracikan','DASUKI HUSIN','00-79-36-78','Non - Racikan','1947-06-22','Lantai 1 BPJS','081294712377','3174012206470005','dr. FRANSISKA, Sp.PD., KGH','NR-003',NULL,9,NULL,NULL,NULL,NULL),('NOP/20260121/00015','0901R0130126V007713','NR-002','Menunggu','Dokter-nonracikan','PIETER MICHAEL SIREGAR','00-71-27-45','Non - Racikan','1991-12-10','Lantai 1 BPJS','081905156053','3175071012910011','dr. FRANSISKA, Sp.PD., KGH','NR-002',NULL,17,NULL,NULL,NULL,NULL),('NOP/20260121/00016','0901R0130126V007714','NR-012','Menunggu','Dokter-nonracikan','JULIUS WIDJAJA','00-61-91-85','Non - Racikan','1970-12-11','Lantai 1 BPJS','087898883399','3172051112700003','dr. FRANSISKA, Sp.PD., KGH','NR-012','PRB : Prolanis DM',7,NULL,NULL,NULL,NULL),('NOP/20260121/00019','0901R0130126V007717','NR-004','Menunggu','Dokter-nonracikan','NUR LAELA AN','00-66-41-84','Non - Racikan','1965-05-28','Lantai 1 BPJS','085694525309','3171046805650002','dr. FRANSISKA, Sp.PD., KGH','NR-004','PRB : JT, Prolanis DM',7,NULL,NULL,NULL,NULL),('NOP/20260121/00021','0901R0130126V007724','NR-019','Menunggu','Dokter-nonracikan','SRI PURNOMO','00-87-63-45','Non - Racikan','1953-08-21','Lantai 1 BPJS','082128669540','1471092108530001','dr. FRANSISKA, Sp.PD., KGH','NR-019',NULL,12,NULL,NULL,NULL,NULL),('NOP/20260121/00022','0901R0130126V007725','NR-008','Menunggu','Dokter-nonracikan','SITI MARDIYAH','00-25-61-14','Non - Racikan','1980-09-25','Lantai 1 BPJS','081912050750','3171066509800002','dr. FRANSISKA, Sp.PD., KGH','NR-008',NULL,10,NULL,NULL,NULL,NULL),('NOP/20260121/00024','0901R0130126V007726','NR-016','Menunggu','Dokter-nonracikan','RIATNI','00-65-00-30','Non - Racikan','1962-05-08','Lantai 1 BPJS','081289208025','3171044805620004','dr. HARIS AKMAN, Sp.PD','NR-016',NULL,4,NULL,NULL,NULL,NULL),('NOP/20260121/00026','0901R0130126V007729','NR-014','Menunggu','Dokter-nonracikan','SUDARWIN','00-09-19-59','Non - Racikan','1972-08-10','Lantai 1 BPJS','08976372170','3171061008721001','dr. FRANSISKA, Sp.PD., KGH','NR-014','PRB : Prolanis DM',6,NULL,NULL,NULL,NULL),('NOP/20260121/00029','0901R0130126V007734','NR-010','Menunggu','Dokter-nonracikan','ANG ENG LIE','00-74-82-81','Non - Racikan','1950-03-21','Lantai 1 BPJS','082125009956','3171082103500002','dr. FRANSISKA, Sp.PD., KGH','NR-010',NULL,8,NULL,NULL,NULL,NULL),('NOP/20260121/00030','0901R0130126V007735','NR-015','Menunggu','Dokter-nonracikan','LOE KIM HWA','00-48-73-56','Non - Racikan','1955-02-13','Lantai 1 BPJS','081808929229','3171045302550002','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-015',NULL,4,NULL,NULL,NULL,NULL),('NOP/20260121/00031','0901R0130126V007736','NR-017','Menunggu','Dokter-nonracikan','MULIAWATI','00-74-69-42','Non - Racikan','1957-11-11','Lantai 1 BPJS','081315979025','3175065111570007','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-017',NULL,2,NULL,NULL,NULL,NULL),('NOP/20260121/00032','0901R0130126V007737','NR-011','Menunggu','Dokter-nonracikan','PASURIA HASIBUAN','00-69-73-53','Non - Racikan','1954-06-18','Lantai 1 BPJS','087889238139','3175026502520003','dr. FRANSISKA, Sp.PD., KGH','NR-011',NULL,10,NULL,NULL,NULL,NULL),('NOP/20260121/00037','0901R0130126V007742','NR-018','Menunggu','Dokter-nonracikan','FERDY AFRIAN WIBOWO','00-85-46-57','Non - Racikan','1975-12-01','Lantai 1 BPJS','08111342994','3171030112750007','dr. FRANSISKA, Sp.PD., KGH','NR-018',NULL,5,NULL,NULL,NULL,NULL),('NOP/20260121/00038','0901R0130126V007743','NR-021','Menunggu','Dokter-nonracikan','SYAFINAL SJAFI\'I','00-77-84-92','Non - Racikan','1949-07-15','Lantai 1 BPJS','081385891191','3171082605500001','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-021','PRB : JT, Prolanis HT',1,NULL,NULL,NULL,NULL),('NOP/20260121/00051','0901R0130126V007755','NR-024','Menunggu','Dokter-nonracikan','SITI PARIHAT','00-78-75-68','Non - Racikan','1954-12-08','Lantai 1 BPJS','082113005545','3171044812540003','dr. FRANSISKA, Sp.PD., KGH','NR-024','PRB : Prolanis DM, Prolanis HT',7,NULL,NULL,NULL,NULL),('NOP/20260121/00053','0901R0130126V007758','NR-341','Menunggu','Dokter-nonracikan','AGUS RIJANTO SURYASIM','00-77-44-98','Non - Racikan','1944-08-25','Lantai 1 BPJS','0816999468','3175022508440003','dr. JO CAROLINA MARGARET, Sp.PD','NR-341','PRB : JT',6,NULL,NULL,NULL,NULL),('NOP/20260121/00054','0901R0130126V007759','NR-009','Menunggu','Dokter-nonracikan','BRONSON SIREGAR','00-81-04-12','Non - Racikan','1976-08-31','Lantai 1 BPJS','081288066990','3174023108760004','dr. Enita Tiur Rohana, Sp.KJ','NR-009',NULL,6,NULL,NULL,NULL,NULL),('NOP/20260121/00058','0901R0130126V007762','RC-010','Menunggu','Dokter-racikan','MAGDALENA MANGESTI.SW','00-04-15-00','Racikan','1960-10-24','Lantai 1 BPJS','085745753858','3175016410600003','dr. JO CAROLINA MARGARET, Sp.PD','RC-010','PRB : HT, Prolanis HT',7,NULL,NULL,NULL,NULL),('NOP/20260121/00061','0901R0130126V007765','NR-013','Menunggu','Dokter-nonracikan','BUDI IRIANI','00-66-69-69','Non - Racikan','1963-05-26','Lantai 1 BPJS','08896538138','3171076605630002','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-013','PRB : DM, Prolanis DM, Prolanis HT',3,NULL,NULL,NULL,NULL),('NOP/20260121/00070','0901R0130126V007769','NR-029','Menunggu','Dokter-nonracikan','CUTRIWATI','00-52-30-39','Non - Racikan','1979-01-03','Lantai 1 BPJS','082110379938','3172064301790002','dr. FRANSISKA, Sp.PD., KGH','NR-029',NULL,1,NULL,NULL,NULL,NULL),('NOP/20260121/00077','0901R0130126V007773','NR-020','Menunggu','Dokter-nonracikan','DEVIANA CAHYA FITRI','00-88-13-94','Non - Racikan','2001-12-05','Lantai 1 BPJS','0895635132799','3174024512010002','dr. Noviyani Sugiarto, Sp.OG','NR-020',NULL,2,NULL,NULL,NULL,NULL),('NOP/20260121/00079','0901R0130126V007775','NR-026','Menunggu','Dokter-nonracikan','ALINA SUSI SEMBIRING','00-31-75-75','Non - Racikan','1963-05-04','Lantai 1 BPJS','08569889125','3171034405630006','dr. Emon Winardi Danudirgo, Sp.PD, FINASIM','NR-026',NULL,2,NULL,NULL,NULL,NULL),('NOP/20260121/00080','0901R0130126V007776','NR-023','Menunggu','Dokter-nonracikan','LANCE LESMANA','00-05-05-55','Non - Racikan','1954-03-22','Lantai 1 BPJS','08128304286','3171086203540001','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-023',NULL,3,NULL,NULL,NULL,NULL),('NOP/20260121/00081','0901R0130126V007777','NR-359','Menunggu','Dokter-nonracikan','TIUR YATI','00-28-75-89','Non - Racikan','1974-02-11','Lantai 1 BPJS','085163517128','3171085102740005','dr. Enita Tiur Rohana, Sp.KJ','NR-359',NULL,4,NULL,NULL,NULL,NULL),('NOP/20260121/00083','0901R0130126V007780','NR-342','Menunggu','Dokter-nonracikan','MARDIAH','00-85-28-27','Non - Racikan','1961-05-10','Lantai 1 BPJS','081314654599','3171085005610006','dr. Rachmat Hamonangan, Sp.PD-KKV, FINASIM, FICA','NR-342',NULL,8,NULL,NULL,NULL,NULL),('NOP/20260121/00085','0901R0130126V007781','NR-356','Menunggu','Dokter-nonracikan','ZULKIFLI','00-84-48-25','Non - Racikan','1967-01-10','Lantai 1 BPJS','082124203087','3175011001670004','dr. FELIX FEBRIYANO HANGANDI, Sp.B','NR-356',NULL,5,NULL,NULL,NULL,NULL),('NOP/20260121/00086','0901R0130126V007782','NR-353','Menunggu','Dokter-nonracikan','NURHAYATI S','00-60-84-24','Non - Racikan','1953-12-21','Lantai 1 BPJS','081287025653','3275026112530003','dr. A.M. ONNY WITJAKSONO, Sp.JP','NR-353',NULL,6,NULL,NULL,NULL,NULL),('NOP/20260121/00100','0901R0130126V007795','NR-022','Menunggu','Dokter-nonracikan','FERRYANTO TJANDRA','00-19-37-87','Non - Racikan','1956-09-03','Lantai 1 BPJS','081213457699','3216190309560001','dr. Enita Tiur Rohana, Sp.KJ','NR-022','PRB : JT',5,NULL,NULL,NULL,NULL),('NOP/20260121/00102','0901R0130126V007797','NR-028','Menunggu','Dokter-nonracikan','NURATRI PUJI HASTARINI,SE','00-87-16-16','Non - Racikan','1963-01-09','Lantai 1 BPJS','0817193739','3171054901630001','dr. Emon Winardi Danudirgo, Sp.PD, FINASIM','NR-028',NULL,4,NULL,NULL,NULL,NULL),('NOP/20260121/00104','0901R0130126V007798','NR-030','Menunggu','Dokter-nonracikan','GESTY DIVA PRAMESWARI','00-87-75-74','Non - Racikan','1997-04-13','Lantai 1 BPJS','085878514934','3175015304970003','dr. HARIS AKMAN, Sp.PD','NR-030',NULL,2,NULL,NULL,NULL,NULL),('NOP/20260121/00107','0901R0130126V007801','NR-357','Menunggu','Dokter-nonracikan','WILLEM SAHETAPY','00-44-32-56','Non - Racikan','1958-02-01','Lantai 1 BPJS','08179858959','3175010102580002','dr. JO CAROLINA MARGARET, Sp.PD','NR-357','PRB : Prolanis DM',4,NULL,NULL,NULL,NULL),('NOP/20260121/00109','0901R0130126V007806','NR-352','Menunggu','Dokter-nonracikan','FAUZIA','00-74-20-65','Non - Racikan','1944-12-12','Lantai 1 BPJS','082122844875','3171085212440004','dr. A.M. ONNY WITJAKSONO, Sp.JP','NR-352','PRB : Prolanis HT',7,NULL,NULL,NULL,NULL),('NOP/20260121/00111','0901R0130126V007808','NR-027','Menunggu','Dokter-nonracikan','VONI','00-63-98-04','Non - Racikan','1982-04-09','Lantai 1 BPJS','85322228092','3171084904820004','dr. F.A. TIMMY BUDI YUDHANTARA, Sp.M','NR-027',NULL,5,NULL,NULL,NULL,NULL),('NOP/20260121/00114','0901R0130126V007810','NR-351','Menunggu','Dokter-nonracikan','JAP SETIAWAN','00-65-76-05','Non - Racikan','1953-07-06','Lantai 1 BPJS','083804579090','3171030607530005','dr. Robert Sinto, Sp.PD-KPTI','NR-351','PRB : Prolanis DM',4,NULL,NULL,NULL,NULL),('NOP/20260121/00124','0901R0130126V007818','RC-009','Menunggu','Dokter-racikan','TEMMY REINHARD ZINSER','00-26-79-40','Racikan','1972-07-27','Lantai 1 BPJS','08983798250','3275122707720001','dr. Enita Tiur Rohana, Sp.KJ','RC-009','PRB : HT, Prolanis HT',5,NULL,NULL,NULL,NULL),('NOP/20260121/00126','0901R0130126V007822','NR-337','Menunggu','Dokter-nonracikan','LINAWATIE ARNELD','00-31-08-16','Non - Racikan','1948-10-31','Lantai 1 BPJS','085900017760','3171047110480001','dr. FRANSISKA, Sp.PD., KGH','NR-337','PRB : Prolanis DM',9,NULL,NULL,NULL,NULL),('NOP/20260121/00128','0901R0130126V007823','NR-338','Menunggu','Dokter-nonracikan','YB. YUSAK GUNAWAN','00-30-60-71','Non - Racikan','1975-11-22','Lantai 1 BPJS','087885138061','3172062211750003','dr. Robert Sinto, Sp.PD-KPTI','NR-338',NULL,7,NULL,NULL,NULL,NULL),('NOP/20260121/00133','0901R0130126V007829','NR-343','Menunggu','Dokter-nonracikan','IIS PUTRIANA','00-83-06-55','Non - Racikan','1969-12-22','Lantai 1 BPJS','081213929668','3175016212690003','dr. Robert Sinto, Sp.PD-KPTI','NR-343',NULL,10,NULL,NULL,NULL,NULL),('NOP/20260121/00137','0901R0130126V007833','NR-360','Menunggu','Dokter-nonracikan','ERNAWITA','00-80-58-51','Non - Racikan','1964-04-04','Lantai 1 BPJS','08126757717','1371114404640013','dr. Robert Sinto, Sp.PD-KPTI','NR-360',NULL,13,NULL,NULL,NULL,NULL),('NOP/20260121/00139','0901R0130126V007834','NR-355','Menunggu','Dokter-nonracikan','MOY NILAWATI S.','00-84-25-71','Non - Racikan','1954-06-10','Lantai 1 BPJS','081399042140','3171015006540002','dr. A.M. ONNY WITJAKSONO, Sp.JP','NR-355','PRB : JT',3,NULL,NULL,NULL,NULL),('NOP/20260121/00153','0901R0130126V007846','NR-358','Menunggu','Dokter-nonracikan','JUNUS ATMADJA HALIM','00-69-07-00','Non - Racikan','1950-02-13','Lantai 1 BPJS','08176602930','3175031202500007','dr. NADIA NASTASSIA PRIMANANDA, Sp.OT(K)','NR-358',NULL,4,NULL,NULL,NULL,NULL),('NOP/20260121/00158','0901R0130126V007851','NR-344','Menunggu','Dokter-nonracikan','KWA FEJ LIE','00-70-26-54','Non - Racikan','1973-03-16','Lantai 1 BPJS','081805160373','3171075603730002','dr. Ike Adriana, SpJP, Subsp.KI(K), FIHA','NR-344','PRB : JT',9,NULL,NULL,NULL,NULL),('NOP/20260121/00159','0901R0130126V007852','NR-345','Menunggu','Dokter-nonracikan','LILY MARNIATY,WONG','00-68-38-71','Non - Racikan','1949-10-19','Lantai 1 BPJS','081287391518','3172065910490001','dr. Robert Sinto, Sp.PD-KPTI','NR-345','PRB : JT, Prolanis DM, Prolanis HT',23,NULL,NULL,NULL,NULL),('NOP/20260121/00165','0901R0130126V007857','NR-346','Menunggu','Dokter-nonracikan','SRI RAHAYUNINGSIH','00-09-60-62','Non - Racikan','1973-03-28','Lantai 1 BPJS','081380998709','3175016803730006','dr. Robert Sinto, Sp.PD-KPTI','NR-346',NULL,2,NULL,NULL,NULL,NULL),('NOP/20260121/00166','0901R0130126V007858','NR-354','Menunggu','Dokter-nonracikan','SYNTHESA PRAHARANI KSATRYA','00-37-75-73','Non - Racikan','1980-05-22','Lantai 1 BPJS','0817182508','3602146205800003','dr. NADIA NASTASSIA PRIMANANDA, Sp.OT(K)','NR-354','PRB : Prolanis DM',4,NULL,NULL,NULL,NULL),('NOP/20260121/00169','0901R0130126V007859','NR-335','Menunggu','Dokter','HERMAN SAPUTRA','00-80-96-56','Non - Racikan','1945-04-28','Lantai 1 BPJS','087876666211','3171082804450001','dr. FRANSISKA, Sp.PD., KGH','NR-335','PRB : Prolanis HT',5,NULL,NULL,NULL,NULL),('NOP/20260121/00174','0901R0130126V007862','NR-339','Menunggu','Dokter-nonracikan','JEREMYA ESTEPHAN GARCIA','00-32-46-35','Non - Racikan','1993-02-16','Lantai 1 BPJS','087855177414','3174021602930001','dr. FELIX FEBRIYANO HANGANDI, Sp.B','NR-339',NULL,1,NULL,NULL,NULL,NULL),('NOP/20260121/00176','0901R0130126V007864','NR-336','Menunggu','Dokter-nonracikan','KETTY SALEA MURNINING ATI','00-01-10-97','Non - Racikan','1964-09-03','Lantai 1 BPJS','087781553900','3275084309640019','dr. FRANSISKA, Sp.PD., KGH','NR-336','PRB : DM, HT, Prolanis DM, Prolanis HT',5,NULL,NULL,NULL,NULL),('NOP/20260121/00181','0901R0130126V007867','NR-347','Menunggu','Dokter-nonracikan','JOSEF DJOKO HARJANTO','00-12-24-83','Non - Racikan','1947-04-15','Lantai 1 BPJS','08179966243','3674031504470007','dr. Robert Sinto, Sp.PD-KPTI','NR-347',NULL,3,NULL,NULL,NULL,NULL),('NOP/20260121/00218','0901R0130126V007890','NR-361','Menunggu','Dokter-nonracikan','MARGARETA MARIA ALACOQUE','00-05-57-01','Non - Racikan','1970-06-10','Lantai 1 BPJS','081389913800','3171035006700008','dr. ARDENO KRISTIANTO, Sp.PD','NR-361','PRB : Prolanis DM',12,NULL,NULL,NULL,NULL),('NOP/20260121/00242','0901R0130126V007903','NR-362','Menunggu','Dokter-nonracikan','NYI NING SAPTURI','00-80-82-39','Non - Racikan','1969-07-17','Lantai 1 BPJS','081317958781','3174015707690002','dr. Robert Sinto, Sp.PD-KPTI','NR-362','PRB : Prolanis DM',11,NULL,NULL,NULL,NULL),('NOP/20260121/00261','0901R0130126V007911','NR-349','Menunggu','Dokter-nonracikan','SUSANTI TRI RAHAYU','00-87-54-62','Non - Racikan','1968-11-16','Lantai 1 BPJS','081218137755','3175035611680004','dr. Andika Chandra Putra, PhD, Sp.P(K) Onk, FAPSR','NR-349','PRB : Prolanis HT',2,NULL,NULL,NULL,NULL),('NOP/20260121/00269','0901R0130126V007915','NR-340','Menunggu','Dokter-nonracikan','ANGGIAT ISIDORUS SITOHANG','00-57-53-58','Non - Racikan','1953-11-21','Lantai 1 BPJS','08128055170','3175072111530002','dr. Andika Chandra Putra, PhD, Sp.P(K) Onk, FAPSR','NR-340','PRB : JT',2,NULL,NULL,NULL,NULL);
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
INSERT INTO `Verification_Task` VALUES ('NOP/20260121/00008',NULL,NULL,'2026-01-21 08:05:01',NULL,NULL,NULL,NULL,'2026-01-21 09:04:25','Loket 3','Lantai 1 BPJS'),('NOP/20260121/00009',NULL,NULL,'2026-01-21 08:14:00',NULL,NULL,NULL,NULL,'2026-01-21 10:38:11','Loket 2','Lantai 1 BPJS'),('NOP/20260121/00011',NULL,NULL,'2026-01-21 08:20:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00012',NULL,NULL,'2026-01-21 07:50:01',NULL,NULL,NULL,NULL,'2026-01-21 08:31:25','Loket 3','Lantai 1 BPJS'),('NOP/20260121/00014',NULL,NULL,'2026-01-21 07:58:00',NULL,NULL,NULL,NULL,'2026-01-21 08:57:09','Loket 3','Lantai 1 BPJS'),('NOP/20260121/00015',NULL,NULL,'2026-01-21 07:53:00',NULL,NULL,NULL,NULL,'2026-01-21 08:31:36','Loket 3','Lantai 1 BPJS'),('NOP/20260121/00016',NULL,NULL,'2026-01-21 08:42:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00019',NULL,NULL,'2026-01-21 08:02:01',NULL,NULL,NULL,NULL,'2026-01-21 08:57:21','Loket 3','Lantai 1 BPJS'),('NOP/20260121/00021',NULL,NULL,'2026-01-21 08:54:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00022',NULL,NULL,'2026-01-21 08:24:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00024',NULL,NULL,'2026-01-21 08:48:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00026',NULL,NULL,'2026-01-21 08:46:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00029',NULL,NULL,'2026-01-21 08:32:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00030',NULL,NULL,'2026-01-21 08:46:05',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00031',NULL,NULL,'2026-01-21 08:49:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00032',NULL,NULL,'2026-01-21 08:38:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00037',NULL,NULL,'2026-01-21 08:49:04',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00038',NULL,NULL,'2026-01-21 08:58:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00051',NULL,NULL,'2026-01-21 09:03:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00053',NULL,NULL,'2026-01-21 10:36:26',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00054',NULL,NULL,'2026-01-21 08:31:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00058',NULL,NULL,'2026-01-21 10:43:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00061',NULL,NULL,'2026-01-21 08:44:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00070',NULL,NULL,'2026-01-21 09:12:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00077',NULL,NULL,'2026-01-21 08:54:04',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00079',NULL,NULL,'2026-01-21 09:10:00',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00080',NULL,NULL,'2026-01-21 09:02:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00081',NULL,NULL,'2026-01-21 10:56:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00083',NULL,NULL,'2026-01-21 10:36:30',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00085',NULL,NULL,'2026-01-21 10:49:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00086',NULL,NULL,'2026-01-21 10:43:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00100',NULL,NULL,'2026-01-21 08:59:01',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00102',NULL,NULL,'2026-01-21 09:10:08',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00104',NULL,NULL,'2026-01-21 09:12:04',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00107',NULL,NULL,'2026-01-21 10:52:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00109',NULL,NULL,'2026-01-21 10:39:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00111',NULL,NULL,'2026-01-21 09:10:04',NULL,NULL,NULL,NULL,NULL,'Loket 3','Lantai 1 BPJS'),('NOP/20260121/00114',NULL,NULL,'2026-01-21 10:38:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00124',NULL,NULL,'2026-01-21 10:36:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00126',NULL,NULL,'2026-01-21 10:36:09',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00128',NULL,NULL,'2026-01-21 10:36:14',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00133',NULL,NULL,'2026-01-21 10:36:34',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00137',NULL,NULL,'2026-01-21 10:56:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00139',NULL,NULL,'2026-01-21 10:48:01',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00153',NULL,NULL,'2026-01-21 10:52:05',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00158',NULL,NULL,'2026-01-21 10:36:47',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00159',NULL,NULL,'2026-01-21 10:36:53',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00165',NULL,NULL,'2026-01-21 10:36:58',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00166',NULL,NULL,'2026-01-21 10:46:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00169','-','-','2026-01-21 10:35:16',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00174',NULL,NULL,'2026-01-21 10:36:18',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00176',NULL,NULL,'2026-01-21 10:36:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00181',NULL,NULL,'2026-01-21 10:37:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00218',NULL,NULL,'2026-01-21 10:57:03',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00242',NULL,NULL,'2026-01-21 10:58:00',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00261',NULL,NULL,'2026-01-21 10:37:02',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS'),('NOP/20260121/00269',NULL,NULL,'2026-01-21 10:36:22',NULL,NULL,NULL,NULL,NULL,'Loket 2','Lantai 1 BPJS');
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
INSERT INTO `Pharmacy_Task` VALUES ('NOP/20260121/00008','Lantai 1 BPJS','waiting_medicine','Non - Racikan'),('NOP/20260121/00009','Lantai 1 BPJS','waiting_medicine','Non - Racikan'),('NOP/20260121/00011','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00012','Lantai 1 BPJS','pending_pickup_medicine','Non - Racikan'),('NOP/20260121/00014','Lantai 1 BPJS','waiting_medicine','Non - Racikan'),('NOP/20260121/00015','Lantai 1 BPJS','waiting_medicine','Non - Racikan'),('NOP/20260121/00016','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00019','Lantai 1 BPJS','waiting_medicine','Non - Racikan'),('NOP/20260121/00021','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00022','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00024','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00026','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00029','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00030','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00031','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00032','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00037','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00038','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00051','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00053','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00054','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00058','Lantai 1 BPJS','waiting_verification','Racikan'),('NOP/20260121/00061','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00070','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00077','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00079','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00080','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00081','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00083','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00085','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00086','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00100','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00102','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00104','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00107','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00109','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00111','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00114','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00124','Lantai 1 BPJS','waiting_verification','Racikan'),('NOP/20260121/00126','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00128','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00133','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00137','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00139','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00153','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00158','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00159','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00165','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00166','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00169','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00174','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00176','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00181','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00218','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00242','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00261','Lantai 1 BPJS','waiting_verification','Non - Racikan'),('NOP/20260121/00269','Lantai 1 BPJS','waiting_verification','Non - Racikan');
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
INSERT INTO `Medicine_Task` VALUES ('NOP/20260121/00008',NULL,NULL,'2026-01-21 09:04:25',NULL,NULL,NULL,NULL,NULL,'Loket 1','Lantai 1 BPJS'),('NOP/20260121/00009',NULL,NULL,'2026-01-21 10:38:11',NULL,NULL,NULL,NULL,NULL,'Loket 1','Lantai 1 BPJS'),('NOP/20260121/00012',NULL,NULL,'2026-01-21 08:31:25',NULL,NULL,NULL,NULL,'2026-01-21 09:10:48','Loket 1','Lantai 1 BPJS'),('NOP/20260121/00014',NULL,NULL,'2026-01-21 08:57:09',NULL,NULL,NULL,NULL,NULL,'Loket 1','Lantai 1 BPJS'),('NOP/20260121/00015',NULL,NULL,'2026-01-21 08:31:36',NULL,NULL,NULL,NULL,NULL,'Loket 1','Lantai 1 BPJS'),('NOP/20260121/00019',NULL,NULL,'2026-01-21 08:57:21',NULL,NULL,NULL,NULL,NULL,'Loket 1','Lantai 1 BPJS');
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
INSERT INTO `Pickup_Task` VALUES ('NOP/20260121/00012',NULL,NULL,'2026-01-21 09:10:48','2026-01-21 09:10:55',NULL,'2026-01-21 09:11:04',NULL,NULL,'Loket 1','Lantai 1 BPJS');
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

-- Dump completed on 2026-01-21  3:59:58
