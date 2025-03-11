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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectives_implementation`
--

LOCK TABLES `objectives_implementation` WRITE;
/*!40000 ALTER TABLE `objectives_implementation` DISABLE KEYS */;
INSERT INTO `objectives_implementation` VALUES (1,1,'Policy Objective 1 - 25eb7bf6e4354e4','Agency 1','Supporting Agencies 1: 097fc3a59e5a5aec7e53','Key Provisions 1: f4442e5cd4a0f246dd0752c2f','Programs and Activities 1: 25f1e0a8e5683fb7272f'),(2,2,'Policy Objective 2 - ed88a456657b701','Agency 2','Supporting Agencies 2: a993e5a9716158d58481','Key Provisions 2: c1b5980302baf1908f5f9021c','Programs and Activities 2: e1d53e93f68a6864c256'),(3,3,'Policy Objective 3 - 56380afc3cbd4a0','Agency 3','Supporting Agencies 3: 0b244bf5a5e708384a03','Key Provisions 3: 9145543d4b4f1fd8cf2eff1dd','Programs and Activities 3: cd08640007bee3dff315'),(4,4,'Policy Objective 4 - 20be1f3d78e550d','Agency 4','Supporting Agencies 4: 663ae3609c6f0e49a7b6','Key Provisions 4: 9f166b0b0765fc7e41e94eab6','Programs and Activities 4: 3ed3bf11548a85bc1560'),(5,5,'Policy Objective 5 - d590a788c1aa13b','Agency 5','Supporting Agencies 5: e15f29ec917150197831','Key Provisions 5: f970014bda24d04b74dddd1af','Programs and Activities 5: ceb9ba79f99c916b9577'),(6,6,'Policy Objective 6 - 83b311f067b390d','Agency 6','Supporting Agencies 6: a6f7286a0dec628a0556','Key Provisions 6: 22a03eb29f52cebd253796aaa','Programs and Activities 6: 585d06428c4efef3aa49'),(7,7,'Policy Objective 7 - 41ac335231e7aec','Agency 7','Supporting Agencies 7: e59b54a5ebfb56ff9890','Key Provisions 7: 2816c512c05793b63ee2b1fc8','Programs and Activities 7: 783b8ad01f86d908b721'),(8,8,'Policy Objective 8 - 70aae1a6b91699c','Agency 8','Supporting Agencies 8: 7401e030e2f12e0706d4','Key Provisions 8: 4db5736098291b699c0bd8d11','Programs and Activities 8: 08f65b0b3e6cffd0b40c'),(9,9,'Policy Objective 9 - 01f0cac2d329abb','Agency 9','Supporting Agencies 9: b65c38781980d61afffe','Key Provisions 9: a45a31ecbcf80acdae7626cb3','Programs and Activities 9: b10a2c3603dff67a6c7f'),(10,10,'Policy Objective 10 - 76441dba83b888d','Agency 10','Supporting Agencies 10: 1c400453ee89b889fe58','Key Provisions 10: a849542f9503188248c7914df','Programs and Activities 10: 0aa93e5f9902285c0a6f'),(11,11,'Policy Objective 11 - 5e709f7bcf647bc','Agency 11','Supporting Agencies 11: c1e31d2c0ec4821be1de','Key Provisions 11: cbd9bb6e85c63e239228ba54d','Programs and Activities 11: d9bce24bc6530271c1dd');
/*!40000 ALTER TABLE `objectives_implementation` ENABLE KEYS */;
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
