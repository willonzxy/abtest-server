/*
Navicat MySQL Data Transfer

Source Server         : mysql5.5
Source Server Version : 50562
Source Host           : localhost:3306
Source Database       : abtest

Target Server Type    : MYSQL
Target Server Version : 50562
File Encoding         : 65001

Date: 2021-03-12 20:40:37
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for app
-- ----------------------------
DROP TABLE IF EXISTS `app`;
CREATE TABLE `app` (
  `type` int(11) NOT NULL DEFAULT '1' COMMENT '1:web 2:小程序 3:android 4:ios',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL DEFAULT '' COMMENT '应用名称',
  `link` varchar(255) DEFAULT '' COMMENT 'web应用指引链接',
  `verbose` varchar(255) DEFAULT '' COMMENT '描述',
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `creator_id` char(32) CHARACTER SET latin1 DEFAULT NULL,
  `modifier_id` char(32) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of app
-- ----------------------------
INSERT INTO `app` VALUES ('1', '1', '奥拉星官网', 'http://www.100bt.com/alx', '', '2021-03-11 18:34:37', '2021-03-11 18:34:37', '1', '1');
INSERT INTO `app` VALUES ('3', '2', '奥拉星手游Android', '', '', '2021-03-11 20:03:00', '2021-03-11 20:03:00', '1', '1');

-- ----------------------------
-- Table structure for experiment
-- ----------------------------
DROP TABLE IF EXISTS `experiment`;
CREATE TABLE `experiment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL,
  `layer_id` int(11) NOT NULL,
  `name` char(50) NOT NULL COMMENT '实验名称',
  `api` varchar(255) NOT NULL COMMENT '实验代理接口',
  `weight` float NOT NULL COMMENT '实验流量占比',
  `verbose` varchar(255) DEFAULT NULL COMMENT '备注',
  `app_name` char(50) NOT NULL,
  `layer_name` char(50) NOT NULL,
  `creator_id` char(32) DEFAULT NULL,
  `modifier_id` char(32) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exp_app_ref` (`app_id`),
  KEY `exp_layer_ref` (`layer_id`),
  KEY `exp_app_name_ref` (`app_name`),
  KEY `exp_layer_name_ref` (`layer_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of experiment
-- ----------------------------
INSERT INTO `experiment` VALUES ('1', '1', '1', '蓝色小人', 'http://img4.a0bi.com/upload/articleResource/20200716/1594889281698.png', '50', '测试hover率，看大众更喜欢什么颜色', '', '', '1', '1', '2021-03-11 20:17:55', '2021-03-11 20:32:58');
INSERT INTO `experiment` VALUES ('2', '1', '1', '熊猫人', 'http://eclanding-server.100bt.com/1615465337786_fromabtest_65618.png', '50', null, '', '', '1', '1', '2021-03-11 20:22:51', '2021-03-11 20:22:51');

-- ----------------------------
-- Table structure for layer
-- ----------------------------
DROP TABLE IF EXISTS `layer`;
CREATE TABLE `layer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '指向当前场景（层）属于哪个应用',
  `name` char(50) NOT NULL COMMENT '场景名',
  `verbose` varchar(255) DEFAULT NULL COMMENT '备注',
  `audiences` text CHARACTER SET latin1 COMMENT '场景受众配置是串JSON',
  `app_name` char(50) NOT NULL,
  `creator_id` char(32) DEFAULT NULL,
  `modifier_id` char(32) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0 未启动  1运行中  2已推全',
  PRIMARY KEY (`id`),
  KEY `layer_app_id_ref` (`app_id`),
  KEY `layer_app_name_ref` (`app_name`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of layer
-- ----------------------------
INSERT INTO `layer` VALUES ('1', '1', '侧边栏浮动图AB test', '', null, '', '1', '1', '2021-03-11 19:50:56', '2021-03-11 21:07:48', '1');
INSERT INTO `layer` VALUES ('2', '2', '文字大小调整', null, null, '', '1', '1', '2021-03-11 20:03:24', '2021-03-11 20:03:24', '0');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` char(35) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `creator_id` char(32) DEFAULT NULL,
  `modifier_id` char(32) DEFAULT NULL,
  `password` char(32) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'jwl', '2021-03-10 18:50:38', '2021-03-10 18:50:41', '', null, 'd9b1d7db4cd6e70935368a1efb10e377');
