-- Database Initialization for Grade Portal (docs/SPEC.md Section 7.3)

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS academic_calendar CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- student, teacher, admin
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255)
);

-- 2. Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    major VARCHAR(255),
    faculty VARCHAR(255)
);

-- 3. Subjects Table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    instructor VARCHAR(255)
);

-- 4. Grades Table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL,
    grade VARCHAR(5) NOT NULL
);

-- 5. Academic Calendar Table
CREATE TABLE academic_calendar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category VARCHAR(50) DEFAULT 'General'
);

-- 6. Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Refresh Tokens Table (SSO Persistent Session)
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Users
INSERT INTO users (username, role, name, faculty) VALUES
('66010001', 'student', 'Somchai Jaidee', 'Engineering'),
('66010002', 'student', 'Maneerat Suksawat', 'Science'),
('65012345678', 'student', 'Anan Panyarat', 'Engineering'),
('teacher01', 'teacher', 'Dr. Kittisak Charoenwong', 'Engineering'),
('admin', 'admin', 'System Administrator', 'Central IT Office');

-- Students
INSERT INTO students (student_id, name, email, major, faculty) VALUES
('66010001', 'Somchai Jaidee', 'somchai.j@university.ac.th', 'Computer Engineering', 'Engineering'),
('66010002', 'Maneerat Suksawat', 'maneerat.s@university.ac.th', 'Information Technology', 'Science'),
('65012345678', 'Anan Panyarat', 'anan.p@university.ac.th', 'Software Engineering', 'Engineering');

-- Subjects
INSERT INTO subjects (code, name, credits, instructor) VALUES
('CPE101', 'Computer Programming', 3, 'Dr. Kittisak Charoenwong'),
('CPE102', 'Object-Oriented Programming', 3, 'Dr. Kittisak Charoenwong'),
('CPE201', 'Data Structures & Algorithms', 3, 'Dr. Kittisak Charoenwong'),
('CPE301', 'Computer Networks', 3, 'Asst. Prof. Viroj Tang'),
('CPE302', 'Database Systems', 3, 'Dr. Kittisak Charoenwong'),
('GEN101', 'English for Academic Purposes', 3, 'Aj. Sarah Jenkins'),
('MTH101', 'Calculus I', 3, 'Assoc. Prof. Prasert Som');

-- Grades for 66010001 (Somchai Jaidee)
INSERT INTO grades (student_id, subject_id, semester, grade) VALUES
(1, 1, '1/2566', 'A'),
(1, 6, '1/2566', 'B+'),
(1, 7, '1/2566', 'B'),
(1, 2, '2/2566', 'A'),
(1, 3, '2/2566', 'A'),
(1, 4, '1/2567', 'B+'),
(1, 5, '1/2567', 'A');

-- Grades for 66010002 (Maneerat Suksawat)
INSERT INTO grades (student_id, subject_id, semester, grade) VALUES
(2, 1, '1/2566', 'B+'),
(2, 6, '1/2566', 'A'),
(2, 7, '1/2566', 'C+'),
(2, 2, '2/2566', 'B'),
(2, 3, '2/2566', 'B+'),
(2, 5, '1/2567', 'B');

-- Grades for 65012345678 (Anan Panyarat)
INSERT INTO grades (student_id, subject_id, semester, grade) VALUES
(3, 1, '1/2565', 'A'),
(3, 2, '2/2565', 'B+'),
(3, 3, '1/2566', 'A'),
(3, 4, '2/2566', 'A'),
(3, 5, '1/2567', 'A');

-- Academic Calendar Events
INSERT INTO academic_calendar (title, description, start_date, end_date, category) VALUES
('ลงทะเบียนเรียน ภาคการศึกษาที่ 1/2567', 'กำหนดการลงทะเบียนเรียนผ่านระบบออนไลน์สำหรับนักศึกษาทุกชั้นปี', '2026-06-01', '2026-06-15', 'Registration'),
('วันเปิดภาคการศึกษา 1/2567', 'วันแรกของการเรียนการสอนในภาคการศึกษาปกติ', '2026-06-22', '2026-06-22', 'Academic'),
('วันสุดท้ายของการเพิ่ม-ถอนรายวิชา', 'ยื่นคำร้องขอเพิ่มหรือถอนรายวิชาโดยไม่ได้รับอักษร W', '2026-07-06', '2026-07-06', 'Registration'),
('สัปดาห์สอบกลางภาค (Midterm Exam)', 'การสอบวัดผลกลางภาคการศึกษาที่ 1/2567', '2026-08-10', '2026-08-16', 'Exam'),
('กำหนดส่งระดับคะแนน (เกรด) สำหรับอาจารย์', 'อาจารย์ประจำวิชาบันทึกเกรดเข้าสู่ระบบสารสนเทศ', '2026-10-15', '2026-10-22', 'Grade'),
('สัปดาห์สอบไล่ปลายภาค (Final Exam)', 'การสอบวัดผลปลายภาคการศึกษาที่ 1/2567', '2026-10-01', '2026-10-14', 'Exam'),
('วันประกาศผลการเรียนอย่างเป็นทางการ', 'นักศึกษาสามารถตรวจสอบผลการเรียนภาคการศึกษา 1/2567 ผ่านเว็บพอร์ทัล', '2026-10-25', '2026-10-25', 'Grade');

-- Initial Audit Logs
INSERT INTO audit_logs (username, action, created_at) VALUES
('system', 'System database initialized with mock academic schema', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('admin', 'Configured semester 1/2567 academic calendar events', CURRENT_TIMESTAMP - INTERVAL '12 hours');
