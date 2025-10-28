-- 1. 사용할 데이터베이스를 선택합니다.
USE marketten;

-- 2. 생성 순서: 의존성이 없는 테이블부터 생성합니다.
-- (users, site_config, tone_list를 먼저 생성해야 합니다.)

-- users 테이블
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `clear_post` int NOT NULL,
  `pw_flag` bit(1) NOT NULL,
  `temp_post` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `nickname` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `provider` enum('GOOGLE','KAKAO','NAVER','SITE') NOT NULL,
  `role` enum('ADMIN','MANAGER','USER') NOT NULL,
  `status` enum('ACTIVE','DEACTIVATED','SUSPENDED') NOT NULL,
  `tutorial_completed` bit(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- site_config 테이블
DROP TABLE IF EXISTS `site_config`;
CREATE TABLE `site_config` (
  `config_key` varchar(50) NOT NULL,
  `config_value` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- tone_list 테이블
DROP TABLE IF EXISTS `tone_list`;
CREATE TABLE `tone_list` (
  `tone_id` bigint NOT NULL AUTO_INCREMENT,
  `tone_name` varchar(50) NOT NULL,
  `tone_preview` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`tone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. 의존성이 있는 테이블 생성
-- (final_post는 users를 참조)
DROP TABLE IF EXISTS `final_post`;
CREATE TABLE `final_post` (
  `created_date` datetime(6) NOT NULL,
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `updated_date` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `status` varchar(20) NOT NULL,
  `final_tone` varchar(50) NOT NULL,
  `final_content` varchar(5000) DEFAULT NULL,
  `final_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FKps4rstu3p3rnsrbk8i7w1ogb4` (`user_id`),
  CONSTRAINT `FKps4rstu3p3rnsrbk8i7w1ogb4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- (temp_post는 final_post와 users를 참조)
DROP TABLE IF EXISTS `temp_post`;
CREATE TABLE `temp_post` (
  `step` int DEFAULT NULL,
  `input_id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `selected_tone` varchar(20) NOT NULL,
  `keywords` varchar(500) DEFAULT NULL,
  `product_info` varchar(500) DEFAULT NULL,
  `title_keywords` varchar(500) DEFAULT NULL,
  `product_features` varchar(2000) DEFAULT NULL,
  `generated_content` varchar(5000) DEFAULT NULL,
  `user_experience` varchar(5000) DEFAULT NULL,
  `selected_title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`input_id`),
  KEY `FK2j7l4lcox50as05g2etd2a1nf` (`post_id`),
  KEY `FK234ukto50ltckiceutimnp0is` (`user_id`),
  CONSTRAINT `FK234ukto50ltckiceutimnp0is` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK2j7l4lcox50as05g2etd2a1nf` FOREIGN KEY (`post_id`) REFERENCES `final_post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- (keyword_list는 temp_post를 참조)
DROP TABLE IF EXISTS `keyword_list`;
CREATE TABLE `keyword_list` (
  `keyword_search_value` int DEFAULT NULL,
  `input_id` bigint NOT NULL,
  `keyword_id` bigint NOT NULL AUTO_INCREMENT,
  `keyword_name` varchar(255) NOT NULL,
  `average_search_value` int DEFAULT NULL,
  `peak_search_value` int DEFAULT NULL,
  PRIMARY KEY (`keyword_id`),
  KEY `FKtr1f5h9xtb3gr2vg65ymtjrcs` (`input_id`),
  CONSTRAINT `FKtr1f5h9xtb3gr2vg65ymtjrcs` FOREIGN KEY (`input_id`) REFERENCES `temp_post` (`input_id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- (title_list는 temp_post를 참조)
DROP TABLE IF EXISTS `title_list`;
CREATE TABLE `title_list` (
  `input_id` bigint NOT NULL,
  `title_id` bigint NOT NULL AUTO_INCREMENT,
  `title_name` varchar(255) NOT NULL,
  PRIMARY KEY (`title_id`),
  KEY `FK34pnqk0mlp1d9gwcgmggcp53c` (`input_id`),
  CONSTRAINT `FK34pnqk0mlp1d9gwcgmggcp53c` FOREIGN KEY (`input_id`) REFERENCES `temp_post` (`input_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- (visitor_log는 users를 참조... 하지만 FK 제약 없음)
DROP TABLE IF EXISTS `visitor_log`;
CREATE TABLE `visitor_log` (
  `visit_date` datetime(6) NOT NULL,
  `visit_log_id` bigint NOT NULL AUTO_INCREMENT,
  `visitor` bigint DEFAULT NULL,
  PRIMARY KEY (`visit_log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
