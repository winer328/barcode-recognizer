/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1_3306
 Source Server Type    : MySQL
 Source Server Version : 100406
 Source Host           : 127.0.0.1:3306
 Source Schema         : distfmqn_portal

 Target Server Type    : MySQL
 Target Server Version : 100406
 File Encoding         : 65001

 Date: 13/01/2021 18:07:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for catalog_produse
-- ----------------------------
DROP TABLE IF EXISTS `catalog_produse`;
CREATE TABLE `catalog_produse`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cod_produs` int(11) NOT NULL,
  `name_produs` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `gramaj` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pret_fara_tva` decimal(20, 3) NOT NULL,
  `pret_cu_tva` decimal(20, 3) NOT NULL,
  `cod_de_bare` varchar(48) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `foto` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `furnizor` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `data_adaugare` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `prod_code`(`cod_produs`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 95 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of catalog_produse
-- ----------------------------
INSERT INTO `catalog_produse` VALUES (88, 3291848, 'Savarina', '150', 7.500, 8.175, '5180613059116', 'images/catalog/crissmar/3291848', 'crissmar', '10/01/2021 02:58:42');
INSERT INTO `catalog_produse` VALUES (87, 5779060, 'Natalia', '140', 7.500, 8.175, '5180613003119', 'images/catalog/crissmar/5779060', 'crissmar', '10/01/2021 02:58:18');
INSERT INTO `catalog_produse` VALUES (85, 3262653, 'Amandina', '140', 7.500, 8.175, '5180613020819', 'images/catalog/crissmar/3262653', 'crissmar', '10/01/2021 02:56:57');
INSERT INTO `catalog_produse` VALUES (86, 5181700, 'Ciocolatina', '140', 7.500, 8.175, '5180613020802', 'images/catalog/crissmar/5181700', 'crissmar', '10/01/2021 02:57:59');
INSERT INTO `catalog_produse` VALUES (89, 5165213, 'Tiramisu', '140', 7.500, 8.175, '5183513013929', 'images/catalog/crissmar/5165213', 'crissmar', '10/01/2021 02:59:09');
INSERT INTO `catalog_produse` VALUES (90, 7976718, 'Boema', '140', 7.500, 8.175, '5183311062396', 'images/catalog/crissmar/7976718', 'crissmar', '10/01/2021 03:00:03');
INSERT INTO `catalog_produse` VALUES (91, 1281508, 'Antonia', '140', 7.500, 8.175, '5180613020826', 'images/catalog/crissmar/1281508', 'crissmar', '10/01/2021 03:00:26');
INSERT INTO `catalog_produse` VALUES (92, 1595488, 'Foret Noir', '140', 7.500, 8.175, '5180613009111', 'images/catalog/crissmar/1595488', 'crissmar', '10/01/2021 03:00:51');
INSERT INTO `catalog_produse` VALUES (93, 7591416, 'Miniecler', '200', 7.500, 8.175, '5123154146129', 'images/catalog/crissmar/7591416', 'crissmar', '10/01/2021 03:01:24');
INSERT INTO `catalog_produse` VALUES (94, 4138799, 'Ecler', '150', 7.000, 7.630, '5901234123457', 'images/catalog/crissmar/4138799', 'crissmar', '10/01/2021 03:01:56');

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cod_de_bare` varchar(48) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name_produs` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `count` int(11) NULL DEFAULT NULL,
  `pret_cu_tva` decimal(20, 3) NULL DEFAULT NULL,
  `pret_fara_tva` decimal(20, 3) NULL DEFAULT NULL,
  `scanned_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock
-- ----------------------------
INSERT INTO `stock` VALUES (24, '5901234123457', 'Ecler', 1, 7.630, 7.000, '2021-01-13 11:00:44');
INSERT INTO `stock` VALUES (25, '5901234123457', 'Ecler', 1, 7.630, 7.000, '2021-01-13 11:04:59');
INSERT INTO `stock` VALUES (26, '5901234123457', 'Ecler', 1, 7.630, 7.000, '2021-01-13 11:05:49');
INSERT INTO `stock` VALUES (27, '5901234123457', 'Ecler', 1, 7.630, 7.000, '2021-01-13 11:05:57');
INSERT INTO `stock` VALUES (28, '5901234123457', 'Ecler', 1, 7.630, 7.000, '2021-01-13 11:06:02');

SET FOREIGN_KEY_CHECKS = 1;
