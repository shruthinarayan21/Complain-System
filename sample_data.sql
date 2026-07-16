-- College Complaint Management System
-- Database: complaint_system
-- Use this file to understand the schema and seed sample data manually.

CREATE DATABASE IF NOT EXISTS complaint_system;
USE complaint_system;

-- The schema is auto-created by Spring Boot JPA when 'spring.jpa.hibernate.ddl-auto=update' is set in application.properties.
-- Below are the SQL structures for reference:

-- 1. users table
-- CREATE TABLE IF NOT EXISTS users (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   role VARCHAR(50) NOT NULL
-- );

-- 2. complaints table
-- CREATE TABLE IF NOT EXISTS complaints (
--   id BIGINT AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   description VARCHAR(1000) NOT NULL,
--   category VARCHAR(100) NOT NULL,
--   priority VARCHAR(50) NOT NULL,
--   status VARCHAR(50) NOT NULL,
--   assigned_staff VARCHAR(255) DEFAULT NULL,
--   created_date DATETIME NOT NULL,
--   user_id BIGINT NOT NULL,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- --------------------------------------------------------
-- Sample Insert Data
-- Passwords are encrypted using BCrypt.
-- The password hash below matches 'student123'.
-- Admin account 'admin@college.edu' (password 'admin123') is auto-seeded at backend startup.

-- Seed a student: student@college.edu / student123
INSERT INTO users (id, name, email, password, role) VALUES
(2, 'Amit Sharma (Student)', 'student@college.edu', '$2a$10$KMiID2MMiZmSil/OGmucTeJyKnfBE.w/qb/FnTpLPbHvjbgHiL.Ou', 'ROLE_STUDENT')
ON DUPLICATE KEY UPDATE id=id;

-- Seed some initial complaints
INSERT INTO complaints (id, title, description, category, priority, status, assigned_staff, created_date, user_id) VALUES
(1, 'Hostel Room Fan Not Working', 'The ceiling fan in Hostel Block C, Room 302 has stopped working. Please replace or repair it.', 'Hostel', 'High', 'Pending', NULL, NOW(), 2),
(2, 'Reference Book Missing from CSE Library section', 'The standard textbook for Computer Networks by Tanenbaum is missing in the central library racks.', 'Library', 'Low', 'Assigned', 'Prof. Ramesh (Librarian)', NOW(), 2),
(3, 'College Bus Route 4 Delay', 'College bus route 4 is arriving 30 minutes late everyday, causing students to miss the first lecture.', 'Transport', 'Medium', 'Resolved', 'Transport In-charge Mr. Kumar', NOW(), 2)
ON DUPLICATE KEY UPDATE id=id;
