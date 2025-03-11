-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: ordinances
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ordinances`
--

DROP TABLE IF EXISTS `ordinances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordinances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `number` varchar(50) DEFAULT NULL,
  `date_issued` date DEFAULT NULL,
  `policies` text,
  `date_effectivity` date DEFAULT NULL,
  `status` enum('Pending','Approved','Implemented','Under Review','Amended') DEFAULT NULL,
  `related_ordinances` text,
  `file_path` varchar(255) DEFAULT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordinances`
--

LOCK TABLES `ordinances` WRITE;
/*!40000 ALTER TABLE `ordinances` DISABLE KEYS */;
INSERT INTO `ordinances` VALUES (1,'Test Title','53','1111-11-11','test','3333-12-31','Amended','test','pkpadmin,+1008-4741-1-CE.pdf','Executive Order'),(2,'Public Safety Ordinance','593','2024-11-16','Ensuring public safety and order.','2025-04-02','Pending',NULL,'/files/ordinance_1.pdf','PDF'),(3,'Environmental Protection Act','994','2024-07-31','Regulating waste disposal and pollution.','2025-03-12','Approved',NULL,'/files/ordinance_2.pdf','PDF'),(4,'Business Licensing Regulation','522','2024-10-16','Guidelines for business permits and renewals.','2025-03-22','Implemented',NULL,'/files/ordinance_3.pdf','PDF'),(5,'Traffic Management Rules','960','2024-09-07','Regulations for road safety and traffic.','2025-03-29','Under Review',NULL,'/files/ordinance_4.pdf','PDF'),(6,'Health and Sanitation Code','691','2024-08-28','Standards for sanitation and hygiene.','2025-03-27','Amended',NULL,'/files/ordinance_5.pdf','PDF'),(7,'Education Support Act','369','2025-02-15','Providing aid to educational institutions.','2025-03-16','Pending',NULL,'/files/ordinance_6.pdf','PDF'),(8,'Fire Prevention Measures','868','2024-06-26','Rules for fire safety and emergency response.','2025-04-06','Approved',NULL,'/files/ordinance_7.pdf','PDF'),(9,'Noise Pollution Control','481','2024-07-17','Regulating noise levels in public areas.','2025-04-02','Implemented',NULL,'/files/ordinance_8.pdf','PDF'),(10,'Waste Management Guidelines','52','2024-04-29','Handling of waste and recycling processes.','2025-03-14','Under Review',NULL,'/files/ordinance_9.pdf','PDF'),(11,'Public Transport Regulations','211','2024-08-12','Rules for public transportation system.','2025-03-17','Amended',NULL,'/files/ordinance_10.pdf','PDF'),(12,'Test 2','12','1111-11-11','Test 2 ordinance','2222-02-22','Pending','none','dummy.pdf','Ordinance');
/*!40000 ALTER TABLE `ordinances` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-11 18:41:34
