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
-- Table structure for table `budget_allocation`
--

DROP TABLE IF EXISTS `budget_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int DEFAULT NULL,
  `allocated_budget` decimal(15,2) DEFAULT NULL,
  `utilized_budget` decimal(15,2) DEFAULT NULL,
  `gad_budget` decimal(15,2) DEFAULT NULL,
  `financial_transparency_measures` text,
  PRIMARY KEY (`id`),
  KEY `ordinance_id` (`ordinance_id`),
  CONSTRAINT `budget_allocation_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_allocation`
--

LOCK TABLES `budget_allocation` WRITE;
/*!40000 ALTER TABLE `budget_allocation` DISABLE KEYS */;
INSERT INTO `budget_allocation` VALUES (1,1,20000.00,30000.00,40000.00,'');
/*!40000 ALTER TABLE `budget_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coverage_scope`
--

DROP TABLE IF EXISTS `coverage_scope`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coverage_scope` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int NOT NULL,
  `inclusive_period` varchar(255) DEFAULT NULL,
  `target_beneficiaries` enum('General Public','Women','Children','Solo Parents','PWDs','MSMEs','Others','Labor Trade','Industry','Economic Enterprises','Environmental Protection & Ecology','Family','Human Resource Management & Development','Finance','Infrastructure & General Services') DEFAULT 'General Public',
  `geographical_coverage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ordinance` (`ordinance_id`),
  CONSTRAINT `coverage_scope_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coverage_scope`
--

LOCK TABLES `coverage_scope` WRITE;
/*!40000 ALTER TABLE `coverage_scope` DISABLE KEYS */;
INSERT INTO `coverage_scope` VALUES (1,1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `coverage_scope` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentation_reports`
--

DROP TABLE IF EXISTS `documentation_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentation_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int DEFAULT NULL,
  `related_documents` text,
  `filepath` text,
  PRIMARY KEY (`id`),
  KEY `ordinance_id` (`ordinance_id`),
  CONSTRAINT `documentation_reports_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentation_reports`
--

LOCK TABLES `documentation_reports` WRITE;
/*!40000 ALTER TABLE `documentation_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentation_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impact_assessment`
--

DROP TABLE IF EXISTS `impact_assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impact_assessment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int DEFAULT NULL,
  `funding_source` enum('General Fund','Grants','Others') DEFAULT NULL,
  `outcomes_results` text,
  `gender_responsiveness_impact` text,
  `community_benefits` text,
  `adjustments_needed` text,
  PRIMARY KEY (`id`),
  KEY `ordinance_id` (`ordinance_id`),
  CONSTRAINT `impact_assessment_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impact_assessment`
--

LOCK TABLES `impact_assessment` WRITE;
/*!40000 ALTER TABLE `impact_assessment` DISABLE KEYS */;
INSERT INTO `impact_assessment` VALUES (1,1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `impact_assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitoring_compliance`
--

DROP TABLE IF EXISTS `monitoring_compliance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoring_compliance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int DEFAULT NULL,
  `indicators_of_success` text,
  `monitoring_frequency` enum('Monthly','Quarterly','Annually') DEFAULT NULL,
  `compliance_rate` decimal(5,2) DEFAULT NULL,
  `challenges` text,
  `violations_reports` text,
  `feedback_mechanisms` text,
  PRIMARY KEY (`id`),
  KEY `ordinance_id` (`ordinance_id`),
  CONSTRAINT `monitoring_compliance_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitoring_compliance`
--

LOCK TABLES `monitoring_compliance` WRITE;
/*!40000 ALTER TABLE `monitoring_compliance` DISABLE KEYS */;
INSERT INTO `monitoring_compliance` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `monitoring_compliance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objectives_implementation`
--

DROP TABLE IF EXISTS `objectives_implementation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objectives_implementation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordinance_id` int DEFAULT NULL,
  `policy_objectives` text,
  `lead_agency` varchar(255) DEFAULT NULL,
  `supporting_agencies` text,
  `key_provisions` text,
  `programs_activities` text,
  PRIMARY KEY (`id`),
  KEY `ordinance_id` (`ordinance_id`),
  CONSTRAINT `objectives_implementation_ibfk_1` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectives_implementation`
--

LOCK TABLES `objectives_implementation` WRITE;
/*!40000 ALTER TABLE `objectives_implementation` DISABLE KEYS */;
INSERT INTO `objectives_implementation` VALUES (1,1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `objectives_implementation` ENABLE KEYS */;
UNLOCK TABLES;

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
  `details` text,
  `date_effectivity` date DEFAULT NULL,
  `status` enum('Pending','Approved','Implemented','Under Review','Amended') DEFAULT NULL,
  `related_ordinances` text,
  `file_path` varchar(255) DEFAULT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordinances`
--

LOCK TABLES `ordinances` WRITE;
/*!40000 ALTER TABLE `ordinances` DISABLE KEYS */;
INSERT INTO `ordinances` VALUES (1,'test','EO No.123','1111-11-11','test','2222-02-22','Pending',NULL,NULL,'Executive Order');
/*!40000 ALTER TABLE `ordinances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `records_logs`
--

DROP TABLE IF EXISTS `records_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `records_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `ordinance_id` int DEFAULT NULL,
  `action` enum('added','edited','deleted') NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `records_logs_ibfk_2` (`ordinance_id`),
  CONSTRAINT `records_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `records_logs_ibfk_2` FOREIGN KEY (`ordinance_id`) REFERENCES `ordinances` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records_logs`
--

LOCK TABLES `records_logs` WRITE;
/*!40000 ALTER TABLE `records_logs` DISABLE KEYS */;
INSERT INTO `records_logs` VALUES (1,1,1,'added','2025-04-15 15:43:10',NULL);
/*!40000 ALTER TABLE `records_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `user_firstname` varchar(250) NOT NULL,
  `user_middlename` varchar(250) NOT NULL,
  `user_lastname` varchar(250) NOT NULL,
  `user_office` varchar(250) NOT NULL,
  `user_email` varchar(250) NOT NULL,
  `user_image` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$12$BimLi9R8/dt7xkwMpLoX7OUJhMBXh8CV361QzRGrwDS/HrV3sC0ue','admin','JCM','C','R','MO','JCMCR@JCMCR.COM','485762141_3987736468210553_2287013454309264154_n.png'),(3,'admin1','$2b$12$7Ek1iDX4fFLN/7MA/O5Bb.aSV.HPQyOO3C9VKAJWyW0a/MRdq5Ifu','admin','','','','','',''),(4,'test','$2b$12$YV.xe1aHSrXkPsJ0IKM7t.a8Wet4La5J0ceTMYEyw60ZN9.CWkuAm','user','test','test','test','test','test@test.com','476499628_956063583345350_5749329388925613002_n.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-21 10:26:18
