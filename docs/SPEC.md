# System Specification
## Central Authentication Service (CAS) / SSO with RADIUS

> เอกสารนี้ใช้กำหนดรายละเอียดทางเทคนิคของระบบ
> กรุณากรอกข้อมูลในส่วน TODO ก่อนเริ่มพัฒนา

---

# 1. Project Overview

## 1.1 Project Name

TODO:
- ชื่อโปรเจกต์ที่ต้องการใช้: Grade

---

## 1.2 Project Objective

TODO:
- ระบบนี้สร้างขึ้นเพื่อแก้ปัญหาอะไร?: เพื่อแก้ปัญหาการดูเกรดและติดตามปฏิทินการศึกษาที่อาจเข้าถึงได้ยากหรือข้อมูลอยู่หลายที่ ทำให้นักศึกษาสามารถเข้ามาดูข้อมูลต่าง ๆ ได้สะดวกขึ้นในเว็บไซต์เดียว

- ต้องการให้ผู้ใช้สามารถทำอะไรได้? : ผู้ใช้สามารถเข้าสู่ระบบ ดูเกรดและตรวจสอบปฏิทินการศึกษาได้

- เป้าหมายหลักของระบบคืออะไร?: ต้องการสร้างเว็บไซต์ที่ช่วยให้นักศึกษาดูเกรดการเรียนของตัวเองได้ง่าย สะดวก และรวดเร็วมากขึ้น โดยมีระบบจดจำการล็อกอินเพื่ออำนวยความสะดวกให้ผู้ใช้ไม่ต้องล็อกอินซ้ำบ่อยๆ

---

## 1.3 Scope

TODO:
- ระบบครอบคลุมอะไรบ้าง? : ระบบจะมีการเข้าสู่ระบบ ดูข้อมูลนักศึกษดูรายวิชา และดูปฏิทินการศึกษา รวมถึงมีส่วนสำหรับผู้ดูแลระบบในการจัดการข้อมูล

- ระบบไม่ครอบคลุมอะไรบ้าง? : ระบบนี้ยังไม่รองรับการลงทะเบียนเรียน การจ่ายค่าเทอม หรือการแก้ไขเกรดโดยนักศึกษา

- ต้องมี Web Application กี่ตัว? : มีทั้งหมด 2 ส่วน คือ ส่วนของนักศึกษาสำหรับดูข้อมูล และส่วนของ Admin สำหรับจัดการข้อมูลภายในระบบ

- ต้องมีระบบ Login แบบใด? : ใช้การ Login ด้วย Username และ Password โดยแต่ละผู้ใช้จะมีสิทธิ์การใช้งานแตกต่างกัน เช่น นักศึกษาและ Admin

---

# 2. System Architecture

## 2.1 Architecture

ระบบประกอบด้วย Component ต่อไปนี้:

- Client
- Nginx Reverse Proxy
- Central Authentication Service
- RADIUS Server
- Web Application
- Database (ถ้ามี)

TODO:
- ต้องการเพิ่ม Component อื่นหรือไม่? : อาจเพิ่ม Admin Dashboard สำหรับให้ผู้ดูแลระบบจัดการข้อมูลเกรด ข้อมูลนักศึกษา และปฏิทินการศึกษา

- ต้องมี Database หรือไม่? : มี เพราะระบบต้องเก็บข้อมูลนักศึกษา ข้อมูลผู้ใช้งาน เกรด รายวิชา และข้อมูลปฏิทินการศึกษา

- ถ้ามี Database ใช้? : ใช้ PostgreSQL สำหรับเก็บข้อมูลของระบบ

- ต้องมี Web Application กี่ระบบ? : มี 2 ระบบ ได้แก่ Web Application สำหรับนักศึกษา และ Web Application สำหรับ Admin

---

## 2.2 Component Responsibilities

### Client

TODO:
- ผู้ใช้สามารถทำอะไรได้บ้าง? : ผู้ใช้สามารถเข้าสู่ระบบผ่าน SSO เพื่อเข้าใช้งานเว็บไซต์ ดูข้อมูลส่วนตัว ดูผลการเรียน ตรวจสอบเกรด และดูปฏิทินการศึกษาได้ โดย Admin สามารถจัดการข้อมูลภายในระบบได้

- Login ผ่านหน้าไหน? : ผู้ใช้ Login ผ่านหน้า Central Authentication Service โดยเมื่อ Login สำเร็จ ระบบจะส่งผู้ใช้กลับไปยัง Web Application ที่ต้องการใช้งาน

- ต้องรองรับ Browser อะไรบ้าง? : รองรับ Browser หลัก เช่น Google Chrome, Microsoft Edge และ Mozilla Firefox

### Nginx

TODO:
- ต้องทำหน้าที่อะไร? : ทำหน้าที่เป็น Reverse Proxy รับ Request จากผู้ใช้และส่งต่อไปยัง Service ที่เกี่ยวข้อง เช่น Central Auth Service หรือ Web Application

- ต้อง Route URL อะไรบ้าง? : /auth/ → Central Authentication Service / SSO API
/student/ → Student Web Application
/admin/ → Admin Web Application

ต้องการ URL อื่นหรือไม่: อาจมี /api/ สำหรับใช้เรียก API ของระบบ และ /logout/ สำหรับออกจากระบบ

TODO:

### Central Authentication Service

TODO:
- Login ด้วย Username/Password หรือวิธีอื่น? : ใช้ Username และ Password โดยผู้ใช้กรอกข้อมูลผ่านหน้า Login ของระบบ

- ติดต่อ RADIUS อย่างไร? : Central Auth Service จะส่งข้อมูล Username และ Password ไปตรวจสอบกับ FreeRADIUS ผ่าน RADIUS Protocol ถ้าข้อมูลถูกต้องจึงให้ Login ผ่าน

- หลัง Login สำเร็จต้องทำอะไร? : ระบบจะสร้าง JWT ให้ผู้ใช้ แล้วส่งกลับไปยัง Web Application เพื่อให้ผู้ใช้สามารถเข้าใช้งานระบบได้โดยไม่ต้อง Login ใหม่

- หลัง Login ไม่สำเร็จต้องทำอะไร? : ระบบจะแจ้งเตือนว่า Username หรือ Password ไม่ถูกต้อง และให้ผู้ใช้ลอง Login ใหม่

- ต้องสร้าง JWT หรือ Session? : ใช้ JWT เพราะต้องการให้ Central Auth Service สามารถใช้ร่วมกับ Web Application หลายระบบได้

- JWT ต้องมีข้อมูลอะไรบ้าง? : มีข้อมูลที่จำเป็น เช่น User ID, Username, Role และเวลาหมดอายุของ Token

### RADIUS Server

TODO:
- ใช้ FreeRADIUS หรือไม่? : ใช้ FreeRADIUS ตามเงื่อนไขของโปรเจกต์

- ใช้ Authentication แบบใด?: User สำหรับการ Login จะเก็บไว้ในฐานข้อมูลหรือไฟล์ที่ FreeRADIUS สามารถใช้ตรวจสอบได้ โดยในระบบ Demo สามารถใช้ PostgreSQL เป็นฐานข้อมูลได้

- ต้องมี User กี่คนสำหรับ Demo?: มีประมาณ 3-5 คนก็เพียงพอสำหรับการ Demo เช่น นักศึกษา 3 คน และ Admin 1 คน

- ต้องรองรับการเพิ่ม User หรือไม่? : ควรรองรับ เพื่อให้ Admin สามารถเพิ่มผู้ใช้งานใหม่ได้โดยไม่ต้องแก้ไขระบบโดยตรง

### Web Application

TODO:
- Web App มีไว้ทำอะไร? : ใช้เป็นเว็บสำหรับทดสอบการทำงานของ Central Auth Service / SSO และเป็นระบบสำหรับให้นักศึกษาดูเกรดและปฏิทินการศึกษา
- ต้องมี Feature อะไร? : มีหน้า Login, หน้า Dashboard, ดูข้อมูลนักศึกษา, ดูผลการเรียน, ดู GPA, ดูรายวิชา และดูปฏิทินการศึกษา
- ต้องตรวจสอบ JWT อย่างไร? : ทุกครั้งที่ผู้ใช้เข้าหน้าที่ต้อง Login ระบบจะตรวจสอบ JWT ว่าถูกต้องหรือไม่ หมดอายุหรือยัง และข้อมูลภายใน Token ตรงกับผู้ใช้หรือไม่
- ต้องมี Role/Permission หรือไม่? : มี โดยแบ่งอย่างน้อยเป็น Student และ Admin เพื่อกำหนดว่าผู้ใช้แต่ละประเภทสามารถเข้าถึงส่วนไหนของระบบได้บ้าง

---

# 3. Authentication Flow

## 3.1 Login Flow

Expected flow: 

1. User เข้า Web Application
2. Web Application ตรวจสอบ Authentication
3. ถ้ายังไม่ได้ Login → Redirect ไป Central Auth
4. User กรอก Username/Password
5. Central Auth ส่ง Access-Request ไป RADIUS
6. RADIUS ตรวจสอบข้อมูล
7. RADIUS ส่ง Access-Accept / Access-Reject
8. หากสำเร็จ Central Auth สร้าง JWT
9. JWT ถูกส่งกลับไปยัง Browser
10. User ถูก Redirect กลับไปยัง Web Application
11. Web Application ตรวจสอบ JWT
12. อนุญาตให้ User เข้าใช้งาน

TODO:
- Flow ต้องเปลี่ยนจากนี้หรือไม่? : ไม่ต้องเปลี่ยน เพราะ Flow นี้เหมาะกับระบบที่ใช้ Central Auth และ FreeRADIUS ตามเงื่อนไขของโปรเจกต์
- ต้องมี Logout หรือไม่? : มีเพื่อให้ผู้ใช้สามารถออกจากระบบได้อย่างปลอดภัย
- Logout ต้องทำอย่างไร? : เมื่อกด Logout ระบบจะลบ JWT ออกจาก Browser และพาผู้ใช้กลับไปยังหน้า Login
- Token หมดอายุหลังจากกี่นาที/ชั่วโมง? : กำหนดให้ JWT หมดอายุภายใน 1 ชั่วโมง เพื่อไม่ให้ Token สามารถใช้งานได้นานเกินไป
- เมื่อ Token หมดอายุให้ทำอะไร? : ระบบจะไม่อนุญาตให้เข้าใช้งานต่อ และ Redirect ผู้ใช้กลับไปที่ Central Auth เพื่อ Login ใหม่

---

# 4. Authentication

## 4.1 Username

TODO:
- รูปแบบ Username: ใช้รหัสนักศึกษาเป็น Username สำหรับนักศึกษา ส่วน Admin สามารถใช้ชื่อที่กำหนดไว้สำหรับระบบ
- ตัวอย่าง Username: 65012345678

## 4.2 Password

TODO:
- Password มีข้อกำหนดอะไร? : กำหนดให้ Password มีความยาวอย่างน้อย 8 ตัว และควรมีทั้งตัวอักษรและตัวเลข
- Minimum length: 8 ตัวอักษร
- ต้องมีตัวเลขหรือไม่? : ต้องมีอย่างน้อย 1 ตัว
- ต้องมีตัวอักษรพิเศษหรือไม่? : ไม่บังคับ แต่แนะนำให้มีเพื่อเพิ่มความปลอดภัย

## 4.3 RADIUS

TODO:
- RADIUS Host: freeradius
- RADIUS Port: 1812
- RADIUS Secret: กำหนดเป็น Shared Secret ที่ใช้ร่วมกันระหว่าง Central Auth Service กับ FreeRADIUS เช่น radius_shared_secret
- Authentication Method: ใช้ RADIUS Authentication แบบ PAP สำหรับระบบ Demo
- Timeout: 5 วินาที
- Retry: ลองเชื่อมต่อใหม่ไม่เกิน 3 ครั้ง

---

# 5. JWT Specification

## 5.1 Token Type

TODO:
- Access Token: ใช้ JWT (JSON Web Token) แบบอายุสั้น (เช่น 15 นาที - 1 ชั่วโมง) สำหรับส่งไปกับ HTTP Header (Authorization: Bearer <token>) เพื่อใช้สิทธิ์เข้าดูเกรดและปฏิทิน

- Refresh Token: ใช้เป็น Opaque Token (สตริงสุ่มความปลอดภัยสูง) หรือ JWT อายุยาว (เช่น 30 วัน) เก็บไว้ใน HTTP-Only Cookie เพื่อใช้สำหรับขอ Access Token ใหม่เมื่อ Token เดิมหมดอายุ (กลไกหลักที่ทำให้ไม่ต้องล็อกอินซ้ำ)

## 5.2 JWT Payload

ปัจจุบันระบบมี:

```json
{
  "iss": "central-auth-service",
  "sub": "6601xxxx",
  "name": "Somchai Jaidee",
  "role": "student",
  "faculty": "Engineering",
  "iat": 1715000000,
  "exp": 1715003600
}
```

---

# 6 Roles

## 6.1 Roles Require

TODO:
Student (นักศึกษา): ผู้ใช้งานหลักของระบบที่เข้ามาดูเกรดของตนเอง
Teacher (อาจารย์): ผู้ใช้งานที่เกี่ยวข้องกับการบันทึกหรือจัดการผลการเรียนของนักศึกษา
Admin (ผู้ดูแลระบบ / เจ้าหน้าที่ทะเบียน): ผู้ดูแลระบบส่วนกลาง จัดการฐานข้อมูล และควบคุมข้อมูลปฏิทินการศึกษา

## 6.2 Roles Permission

TODO:

| Role    | Permission     |
| ------- | -------------- |
| Student | View / Reserve |
| Teacher | View / Manage  |
| Admin   | Full Access    |

# 7 Database

## 7.1 Database Require

ใช้อะไรทำ Database: ใช้ PostgreSQL และรันผ่าน Docker (สามารถใช้ Redis ร่วมด้วยสำหรับการทำ Caching เกรดและ Session)

## 7.2 Database Purpose

ใช้เก็บอะไรใน Database: ใช้เก็บข้อมูลผู้ใช้งานเบื้องต้น (ไม่ต้องเก็บรหัสผ่าน), ข้อมูลประวัตินักศึกษา, ข้อมูลเกรดรายวิชา, ข้อมูลปฏิทินการศึกษา, ข้อมูลการทำรายการ (Logs) และ เก็บข้อมูล Refresh Token เพื่อใช้จดจำสถานะการล็อกอินของผู้ใช้

## 7.3 Database Table

TODO:

ตัวอย่าง:

| Column   | Type    | Description |
| -------- | ------- | ----------- |
| id       | INT     | User ID     |
| username | VARCHAR | Username    |
| role     | VARCHAR | User Role   |

เพิ่ม Table:

TODO: users

| Column   | Type    | Description     |
| -------- | ------- | --------------- |
| id       | INT     | รหัสผู้ใช้ (Primary Key) |
| username | VARCHAR | ชื่อผู้ใช้      |
| password | VARCHAR | รหัสผ่าน        |
| role     | VARCHAR | สิทธิ์ของผู้ใช้ |

TODO: students

| Column     | Type    | Description        |
| ---------- | ------- | ------------------ |
| id         | INT     | รหัสข้อมูลนักศึกษา (Primary Key) |
| student_id | VARCHAR | รหัสนักศึกษา       |
| name       | VARCHAR | ชื่อ-นามสกุล       |
| email      | VARCHAR | อีเมล              |
| major      | VARCHAR | สาขาวิชา           |

TODO: grades

| Column     | Type    | Description  |
| ---------- | ------- | ------------ |
| id         | INT     | รหัสเกรด (Primary Key) |
| student_id | INT     | รหัสนักศึกษา (Foreign Key) |
| subject_id | INT     | รหัสวิชา     |
| semester   | VARCHAR | ภาคการศึกษา  |
| grade      | VARCHAR | เกรด         |

TODO: academic_calendar

| Column      | Type    | Description   |
| ----------- | ------- | ------------- |
| id          | INT     | รหัสกิจกรรม (Primary Key) |
| title       | VARCHAR | ชื่อกิจกรรม   |
| description | TEXT    | รายละเอียด    |
| start_date  | DATE    | วันที่เริ่ม   |
| end_date    | DATE    | วันที่สิ้นสุด |

TODO: audit_logs

| Column     | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | INT       | รหัส Log (Primary Key) |
| user_id    | INT       | รหัสผู้ใช้ (Foreign Key) |
| action     | VARCHAR   | การกระทำ เช่น Login, Logout |
| created_at | TIMESTAMP | วันและเวลาที่ทำรายการ       |



TODO

# 8 Error Handling

TODO:

กรณีต่าง ๆ ต้องแสดงผลอย่างไร?

Invalid Username / Password 

TODO: Action: แสดงข้อความว่า “รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง” และให้ผู้ใช้ลอง Login ใหม่ (เพื่อความปลอดภัย จะไม่บอกเจาะจงว่าผิดที่ Username หรือ Password)

RADIUS Server Down

TODO: Action: แสดงข้อความว่า “ไม่สามารถเชื่อมต่อระบบตรวจสอบสิทธิ์ของมหาวิทยาลัยได้ กรุณาลองใหม่ภายหลัง” และไม่อนุญาตให้ Login

RADIUS Timeout

TODO: Action: เมื่อรอเกินเวลาที่กำหนด (เช่น 5 วินาที) ระบบจะตัดการเชื่อมต่อและแสดงข้อความว่า “ระบบใช้เวลาตอบกลับนานเกินไป กรุณาลองใหม่อีกครั้ง”

Invalid JWT

TODO: Action: ระบบ Frontend จะแสดงข้อความว่า “ข้อมูลเซสชันไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่” นำผู้ใช้กลับไปหน้า Login พร้อมกับลบข้อมูล Token ที่ผิดปกติออกทั้งหมด

Expired JWT

TODO: 
1. หาก Access Token หมดอายุ แต่ Refresh Token ยังใช้งานได้อยู่: ระบบ Frontend จะส่งคำขอ (Silent Refresh) ไปขอ Access Token ใหม่เบื้องหลังแบบอัตโนมัติ โดยที่ ผู้ใช้ไม่ต้องรู้ตัวและไม่ต้องล็อกอินใหม่
2. หาก Refresh Token หมดอายุด้วย หรือถูกลบออกจากระบบ: ระบบจะเตะผู้ใช้ออก พร้อมแสดงข้อความว่า “เซสชันของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง” แล้ว Redirect กลับไปยัง Central Auth

Unauthorized User

TODO: Action: แสดงหน้า 403 Forbidden พร้อมข้อความว่า “คุณไม่มีสิทธิ์เข้าถึงหน้านี้” และไม่อนุญาตให้เข้าถึงข้อมูลที่ไม่มีสิทธิ์ (เช่น Student พยายามเข้า URL ของ Admin เพื่อแก้ไขปฏิทิน)

# 9. Testing Requirements

ส่วนนี้กำหนดวิธีการทดสอบระบบ Central Authentication Service (CAS) / SSO with RADIUS

---

## 9.1 Authentication Testing

### TC-AUTH-01: Login สำเร็จ

**เงื่อนไข:**

* TODO: Username ที่ถูกต้องคือ: 66010001
* TODO: Password ที่ถูกต้องคือ: password123

**Expected Result:**

* [x] Login สำเร็จ
* [x] RADIUS ส่ง `Access-Accept`
* [x] Central Auth สร้าง JWT
* [x] User ถูก Redirect ไปยัง Web Application
* [x] Web Application อนุญาตให้เข้าใช้งาน

---

### TC-AUTH-02: Username ไม่ถูกต้อง

**Input:**

* Username: 99999999
* Password: password123

**Expected Result:**

* [x] RADIUS ส่ง `Access-Reject`
* [x] Login ไม่สำเร็จ
* [x] ไม่สร้าง JWT
* [x] User ไม่สามารถเข้า Web Application ได้

---

### TC-AUTH-03: Password ไม่ถูกต้อง

**Input:**

* Username: 66010001
* Password: wrongpassword

**Expected Result:**

* [x] Login ไม่สำเร็จ
* [x] ไม่สร้าง JWT
* [x] แสดง Error Message

**Error Message ที่ต้องการ:**

TODO:
"รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"

---

### TC-AUTH-04: Username หรือ Password ว่าง

**Input:**

* Username: (ปล่อยว่าง)
* Password: (ปล่อยว่าง)

**Expected Result:**

TODO:ระบบตรวจสอบตั้งแต่ฝั่ง Frontend (Client-side validation) ไม่ส่ง Request ไปยังเซิร์ฟเวอร์ และแสดงข้อความ "กรุณากรอกรหัสผู้ใช้งานและรหัสผ่าน"

---

## 9.2 RADIUS Testing

### TC-RADIUS-01: RADIUS Server ทำงานปกติ

**Test:**

TODO:สั่งรัน Container FreeRADIUS และทดสอบยิง Request จาก Central Auth

**Expected Result:**

TODO:สามารถเชื่อมต่อผ่านพอร์ต 1812 ได้ และ RADIUS ตอบกลับ Access-Accept หรือ Access-Reject ตามข้อมูลที่ส่งไป

---

### TC-RADIUS-02: RADIUS Server ไม่ทำงาน

**Test:**

TODO:สั่ง Stop Container FreeRADIUS และพยายามล็อกอินหน้าเว็บ

**Expected Result:**

TODO:
[x] Login ไม่สำเร็จ
[x] ระบบแสดง Error
[x] ระบบไม่ค้าง
[x] มี Timeout

**Error Message:**

TODO:"ระบบตรวจสอบสิทธิ์ของมหาวิทยาลัยขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง"

---

### TC-RADIUS-03: RADIUS Timeout

**Timeout ที่ต้องการ:**

TODO: 5 seconds

**Expected Result:**

TODO:เมื่อเกิน 5 วินาที Central Auth ต้องยกเลิกการรอ (Abort) และส่ง HTTP 504 Gateway Timeout กลับไปให้ Frontend เพื่อแสดงข้อความแจ้งเตือน

---

### TC-RADIUS-04: RADIUS Secret ไม่ถูกต้อง

**Test:**

TODO:เปลี่ยนค่า RADIUS_SECRET ในไฟล์ .env ของ Central Auth เป็นค่าที่ผิด

**Expected Result:**

TODO:RADIUS Server ปฏิเสธ Request ทันที การล็อกอินล้มเหลว และ Central Auth บันทึก Error Log

---

## 9.3 JWT Testing

### TC-JWT-01: JWT ถูกต้อง

**Test:**

TODO:นำ Access Token ที่ได้จากการล็อกอินสำเร็จ แนบไปกับ Header

**Expected Result:**

* [x] Signature ถูกต้อง
* [x] Token ยังไม่หมดอายุ
* [x] User สามารถเข้า Web Application ได้และได้รับข้อมูลเกรด

---

### TC-JWT-02: ไม่มี JWT

**Test:**

TODO:พยายามพิมพ์ URL เข้าหน้า /grades โดยตรงผ่านโหมดไม่ระบุตัวตน

**Expected Result:**

* [x] ไม่อนุญาตให้เข้า Web Application
* [x] Redirect ไปหน้า Login (Central Auth)

---

### TC-JWT-03: JWT หมดอายุ

**Token Expiration:**

TODO: Access Token 1 hours / Refresh Token 30 days

**Expected Result:**

TODO:
1. หาก Access Token หมดอายุ แต่ Refresh Token ยังใช้งานได้ -> ระบบดึง Access Token ใหม่มาให้เบื้องหลัง (Silent Refresh) ผู้ใช้ใช้งานต่อได้ทันที
2. หากหมดอายุทั้งคู่ -> บังคับ Redirect ไปหน้า Login

---

### TC-JWT-04: JWT ถูกแก้ไข

**Test:**

TODO:
```text
เปลี่ยน role จาก student → admin
```

**Expected Result:**

* [x] Signature ไม่ถูกต้อง (เพราะไม่มี Secret Key ของเซิร์ฟเวอร์)
* [x] Token ถูกปฏิเสธ (HTTP 401)
* [x] ไม่อนุญาตให้เข้าใช้งาน

---

### TC-JWT-05: JWT ถูกสร้างโดยระบบอื่น

**Test:**

TODO:ใช้ Secret Key อื่นจำลองการสร้าง JWT ขึ้นมาเองแล้วส่งเข้าสู่ระบบ

**Expected Result:**

TODO:Backend ตรวจสอบ Signature ไม่ผ่าน ส่งกลับเป็น 401 Unauthorized ทันที

---

## 9.4 Web Application Testing

### TC-WEB-01: เข้า Web Application โดยยังไม่ได้ Login

**URL:**

TODO:http://localhost/ หรือ http://localhost/grades

**Expected Result:**

* [x] Redirect ไป Central Auth (/auth)
* [x] ไม่สามารถเข้าหน้า Protected Page ได้

---

### TC-WEB-02: เข้า Web Application หลัง Login สำเร็จ

**Expected Result:**

* [x] JWT ถูกตรวจสอบ
* [x] User สามารถเข้า Web Application
* [x] แสดงข้อมูล User

---

### TC-WEB-03: Logout

**ต้องการ Logout หรือไม่?**

* [x] Yes

**Logout Flow:**

TODO:User กดปุ่ม Logout -> Web App ส่ง Request ไปที่ API /logout -> ระบบทำการเคลียร์ Refresh Token ในฐานข้อมูล/Redis -> ลบ Token ในเบราว์เซอร์ -> Redirect ไปหน้า Login

**Expected Result:**

TODO:ผู้ใช้ไม่สามารถกดปุ่ม "ย้อนกลับ (Back)" บนเบราว์เซอร์เพื่อเข้ามาดูข้อมูลเดิมได้อีก ต้องล็อกอินใหม่เท่านั้น

---

### TC-WEB-04: Unauthorized Access

**User Role:**

TODO:Student

**Resource ที่พยายามเข้าถึง:**

TODO:/api/admin/calendar/edit

**Expected Result:**

TODO:เซิร์ฟเวอร์ตรวจสอบพบว่า Role ไม่ใช่ Admin จะปฏิเสธและตอบกลับเป็น HTTP 403 Forbidden

---

## 9.5 Role / Authorization Testing

### TC-ROLE-01: Student

**สามารถทำอะไรได้บ้าง:**

TODO:
- ดูเกรดและผลการเรียนของตนเอง
- ดูปฏิทินการศึกษา

---

### TC-ROLE-02: Teacher

**สามารถทำอะไรได้บ้าง:**

TODO:
- ดูปฏิทินการศึกษา
- จัดการบันทึกหรือแก้ไขเกรดของนักศึกษาในรายวิชาที่สอน

---

### TC-ROLE-03: Admin

**สามารถทำอะไรได้บ้าง:**

TODO:
- จัดการ (เพิ่ม/ลบ/แก้ไข) ข้อมูลปฏิทินการศึกษาในระบบ

- ดูภาพรวมระบบ และจัดการสิทธิ์ของผู้ใช้

---

### TC-ROLE-04: User ไม่มีสิทธิ์

**Test:**

TODO:นำ Token ของ Student ไปยิง Request API ในส่วนของ Admin

**Expected Result:**

* [x] HTTP 403
* [ ] Redirect
* [x] แสดงข้อความ Error

---

## 9.6 Nginx Testing

### TC-NGINX-01: `/auth/`

**Expected Destination:**

TODO:Route ไปยัง Container ของ central-auth

**Expected Result:**

TODO:โหลดหน้าเว็บสำหรับกรอก Username / Password ขึ้นมาได้อย่างถูกต้อง

---

### TC-NGINX-02: `/lab/`

**Expected Destination:**

TODO:Route ไปยัง Container ของ web-app-backend

**Expected Result:**

TODO:สามารถเรียก API ข้อมูลเกรดและปฏิทิน โดยต้องแนบ Header Authorization เข้าไปด้วย

---

### TC-NGINX-03: Invalid Route

**Test URL:**

TODO:http://localhost/random-page

**Expected Result:**

TODO:Nginx หรือ React Router ฝั่ง Frontend รับเรื่องและแสดงหน้า 404 Not Found กลับมา

---

## 9.7 Docker Testing

### TC-DOCKER-01: Start ทุก Service

**Command:**

```bash
docker compose up -d --build
```

**Expected Services:**

* [x] nginx

* [x] central-auth

* [x] freeradius

* [x] web-app-frontend

* [x] web-app-backend

* [x] postgres (Database)

* [x] redis (Cache & Session)

---

### TC-DOCKER-02: ตรวจสอบ Container

**Command:**

```bash
docker compose ps
```

**Expected Result:**

TODO:ทุก Container ต้องมีสถานะเป็น Up (Running) และพอร์ตที่เปิดไว้ (เช่น 80, 443) ต้องถูก Map เข้ากับ Host อย่างถูกต้อง

---

### TC-DOCKER-03: Service Restart

**Test:**

TODO:สั่ง docker compose restart postgres

**Expected Result:**

TODO:Database เริ่มทำงานใหม่ ส่วน Backend (Web App / Central Auth) ต้องสามารถดึง Connection กลับมาเชื่อมต่อใหม่ได้อัตโนมัติเมื่อ Database พร้อม โดยไม่ต้องรีสตาร์ทตัวเอง

---

## 9.8 Database Testing

### ต้องทดสอบ Database หรือไม่?

* [x] มี Database

ถ้ามี:

### TC-DB-01: Database Connection

**Expected Result:**

TODO:เมื่อ Backend สตาร์ทขึ้นมา ต้องสามารถ Connect เข้า PostgreSQL และ Redis ได้สำเร็จ ไม่มี Error Connection Refused

### TC-DB-02: Insert Data

**Expected Result:**

TODO:Admin สามารถเพิ่ม Event ใหม่ลงในตารางปฏิทินการศึกษาได้ และข้อมูลปรากฏในฐานข้อมูลจริง

### TC-DB-03: Retrieve Data

**Expected Result:**

TODO:Query ดึงข้อมูลเกรดของรหัสนักศึกษา 66010001 ได้ตรงตาม Mock Data ที่เตรียมไว้

### TC-DB-04: Invalid Data

**Expected Result:**

TODO:หากพยายามบันทึกเกรดที่เป็นตัวอักษรแปลกๆ นอกเหนือจาก (A, B, C, D, F) Database Schema หรือ Backend Validation จะต้องปฏิเสธและคืนค่า 400 Bad Request

---

## 9.9 End-to-End Testing

### TC-E2E-01: Complete SSO Flow

ทดสอบตั้งแต่ User เข้า Web Application จนสามารถใช้งานระบบได้

### Flow

```text
User
 ↓
Web Application
 ↓
ตรวจสอบ JWT
 ↓
ไม่มี JWT
 ↓
Central Authentication
 ↓
Username / Password
 ↓
RADIUS
 ↓
Access-Accept
 ↓
Create JWT
 ↓
Set Cookie
 ↓
Redirect กลับ Web Application
 ↓
Verify JWT
 ↓
Access Granted
```

**Expected Result:**

* [x] ทุกขั้นตอนทำงานสำเร็จ
* [x] User สามารถเข้า Web Application ได้
* [x] Password ไม่ถูกเก็บใน Web Application
* [x] JWT สามารถตรวจสอบได้

---

## 9.10 Failure Testing

ระบบต้องสามารถรับมือกับกรณีผิดพลาดต่อไปนี้:

| Test Case         | Required | Expected Result |
| ----------------- | -------- | --------------- |
| RADIUS Down       | Yes     | แสดง Error Message ว่าระบบตรวจสอบสิทธิ์ขัดข้อง ผู้ใช้เข้าระบบไม่ได้ |
| RADIUS Timeout    | Yes     | หลัง 5 วินาที ระบบหยุดรอและแสดง Timeout Error |
| Invalid Username  | Yes     | ขึ้นข้อความรหัสผ่านหรือผู้ใช้ไม่ถูกต้อง และไม่ได้ JWT |
| Invalid Password  | Yes     | ขึ้นข้อความรหัสผ่านหรือผู้ใช้ไม่ถูกต้อง และไม่ได้ JWT |
| Invalid JWT       | Yes     | ระบบตอบ 401 Unauthorized บังคับล็อกอินใหม่ |
| Expired JWT       | Yes     | ระบบใช้ Refresh Token ขอ JWT ใหม่เบื้องหลัง (ถ้า Refresh หมดอายุด้วย บังคับเข้าหน้าล็อกอิน) |
| Missing JWT       | Yes     | ระบบตอบ 401 Unauthorized บังคับเข้าหน้าล็อกอิน |
| Nginx Down        | Yes     | เว็บโหลดไม่ขึ้น (Connection Refused) |
| Central Auth Down | Yes     | เข้าหน้าเว็บได้ แต่พอกดล็อกอินระบบจะขึ้น 502 Bad Gateway |
| Web App Down      | Yes     | เข้าหน้าเว็บแล้วจะขึ้นจอขาว หรือ API ดึงข้อมูลเกรดไม่ขึ้น (502 Bad Gateway) |
| Database Down     | Yes     | ล็อกอินได้ (ถ้าระบบ Auth แคชไว้) แต่จะเปิดดูเกรดหรือปฏิทินไม่ขึ้น แจ้งเตือนข้อผิดพลาดดึงข้อมูล |

---

## 9.11 Performance Testing

**ต้องทดสอบ Performance หรือไม่?**

* [x] Yes

ถ้าต้องทดสอบ:

**จำนวนผู้ใช้พร้อมกัน:**

TODO: 500 users

**จำนวน Login ต่อวินาที:**

TODO: 50 requests/sec

**Maximum Response Time:**

TODO: 500 ms

---

## 9.12 Security Testing

ต้องทดสอบ:

* [x] Password ไม่ปรากฏใน Web Application หรือ Console Log
* [x] Password ไม่ถูกเก็บใน JWT
* [x] JWT Signature ไม่สามารถปลอมแปลงได้
* [x] JWT มี Expiration Time ชัดเจน
* [x] Refresh Token ถูกเก็บแบบ HTTPOnly Cookie (เพื่อป้องกัน XSS)
* [x] Secure Cookie (ส่งผ่าน HTTPS เท่านั้น ใน Production)
* [x] ระบบจำกัดให้ Unauthorized User ไม่สามารถเข้าถึงข้อมูลเกรด (Protected Resource) ได้
* [x] User ไม่สามารถเปลี่ยน Role ใน JWT เองได้
* [x] ป้องกัน SQL Injection และ XSS ในช่อง Input ทุกช่อง

---

## 9.13 Acceptance Test

ระบบจะถือว่า **ผ่าน** เมื่อ:

* [x] User สามารถ Login ได้ด้วยรหัสนักศึกษา
* [x] Authentication ผ่านระบบจำลองของ RADIUS อย่างถูกต้อง
* [x] Login สำเร็จแล้วได้รับ JWT และเก็บสถานะ Session
* [x] Web Application ตรวจสอบ JWT ได้
* [x] User ที่ไม่มี JWT ไม่สามารถเข้า Protected Resource (ดูเกรด) ได้
* [x] Invalid / Expired JWT ถูกจัดการได้อย่างถูกต้อง (ทำ Silent Refresh ได้)
* [x] RADIUS Error ถูกจัดการอย่างเหมาะสม ไม่ทำระบบค้าง
* [x] Docker Compose สามารถ Start ระบบได้ครบทุกตัวในคำสั่งเดียว
* [x] Nginx สามารถ Route Request ระหว่าง Frontend, Backend และ Auth ได้สมบูรณ์
* [x] ผู้ใช้สามารถเข้ามาดูปฏิทินและเกรดในครั้งถัดไปได้ทันที โดยไม่ต้องกรอกรหัสผ่านซ้ำ (ฟีเจอร์ Remember Me ทำงานสมบูรณ์)

---

## 9.14 Test Environment

**Operating System:**

TODO:Windows 10/11

**Docker Version:**

TODO:Docker Engine 24.0 หรือสูงกว่า

**Docker Compose Version:**

TODO:Docker Compose v2.20 หรือสูงกว่า

**Browser:**

TODO:Google Chrome

**Browser Version:**

TODO:เวอร์ชันล่าสุดที่มีการอัปเดต

**Testing URL:**

TODO:http://localhost

**Other Requirements:**

TODO:โปรแกรม Postman หรือ cURL สำหรับใช้ทดสอบยิง API (API Testing) โดยไม่ต้องผ่านหน้าเว็บ
