# System Specification
## Central Authentication Service (CAS) / SSO with RADIUS

> เอกสารนี้ใช้กำหนดรายละเอียดทางเทคนิคของระบบ
> กรุณากรอกข้อมูลในส่วน TODO ก่อนเริ่มพัฒนา

---

# 1. Project Overview

## 1.1 Project Name

TODO:
- ชื่อโปรเจกต์ที่ต้องการใช้: 

---

## 1.2 Project Objective

TODO:
- ระบบนี้สร้างขึ้นเพื่อแก้ปัญหาอะไร?: เพื่อแก้ปัญหาการดูเกรดและติดตามปฏิทินการศึกษาที่อาจเข้าถึงได้ยากหรือข้อมูลอยู่หลายที่ ทำให้นักศึกษาสามารถเข้ามาดูข้อมูลต่าง ๆ ได้สะดวกขึ้นในเว็บไซต์เดียว

- ต้องการให้ผู้ใช้สามารถทำอะไรได้? : ผู้ใช้สามารถเข้าสู่ระบบ ดูเกรดและตรวจสอบปฏิทินการศึกษาได้

- เป้าหมายหลักของระบบคืออะไร?: ต้องการสร้างเว็บไซต์ที่ช่วยให้นักศึกษาดูข้อมูลเกี่ยวกับการเรียนของตัวเองได้ง่าย สะดวก และรวดเร็วมากขึ้น

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

ใช้อะไรทำ Database: ใช้ PostgreSQL และรันผ่าน Docker

TODO:

## 7.2 Database Purpose

ใช้เก็บอะไรใน Database: ใช้เก็บข้อมูลผู้ใช้ เกรด และปฏิทินการศึกษา

TODO:

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
| id       | INT     | รหัสผู้ใช้      |
| username | VARCHAR | ชื่อผู้ใช้      |
| password | VARCHAR | รหัสผ่าน        |
| role     | VARCHAR | สิทธิ์ของผู้ใช้ |

TODO: students

| Column     | Type    | Description        |
| ---------- | ------- | ------------------ |
| id         | INT     | รหัสข้อมูลนักศึกษา |
| student_id | VARCHAR | รหัสนักศึกษา       |
| name       | VARCHAR | ชื่อ-นามสกุล       |
| email      | VARCHAR | อีเมล              |
| major      | VARCHAR | สาขาวิชา           |

TODO: grades

| Column     | Type    | Description  |
| ---------- | ------- | ------------ |
| id         | INT     | รหัสเกรด     |
| student_id | INT     | รหัสนักศึกษา |
| subject_id | INT     | รหัสวิชา     |
| semester   | VARCHAR | ภาคการศึกษา  |
| grade      | VARCHAR | เกรด         |

TODO: academic_calendar

| Column      | Type    | Description   |
| ----------- | ------- | ------------- |
| id          | INT     | รหัสกิจกรรม   |
| title       | VARCHAR | ชื่อกิจกรรม   |
| description | TEXT    | รายละเอียด    |
| start_date  | DATE    | วันที่เริ่ม   |
| end_date    | DATE    | วันที่สิ้นสุด |

TODO: audit_logs

| Column     | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | INT       | รหัส Log                    |
| user_id    | INT       | รหัสผู้ใช้                  |
| action     | VARCHAR   | การกระทำ เช่น Login, Logout |
| created_at | TIMESTAMP | วันและเวลาที่ทำรายการ       |



TODO

# 8 Error Handling

TODO:

กรณีต่าง ๆ ต้องแสดงผลอย่างไร?

Invalid Username / Password 

TODO: แสดงข้อความว่า “Username หรือ Password ไม่ถูกต้อง” และให้ผู้ใช้ลอง Login ใหม่

RADIUS Server Down

TODO: แสดงข้อความว่า “ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ กรุณาลองใหม่ภายหลัง” และไม่อนุญาตให้ Login

RADIUS Timeout

TODO: แสดงข้อความว่า “ระบบใช้เวลาตอบกลับนานเกินไป กรุณาลองใหม่” และให้ระบบลองเชื่อมต่อใหม่ตามจำนวนครั้งที่กำหนด

Invalid JWT

TODO: แสดงข้อความว่า “Session ไม่ถูกต้อง กรุณา Login ใหม่” และนำผู้ใช้กลับไปหน้า Login

Expired JWT

TODO: แสดงข้อความว่า “Session หมดอายุ กรุณา Login ใหม่” แล้ว Redirect กลับไปยัง Central Auth

Unauthorized User

TODO: แสดงข้อความว่า “คุณไม่มีสิทธิ์เข้าถึงหน้านี้” และไม่อนุญาตให้เข้าถึงข้อมูลที่ไม่มีสิทธิ์ เช่น Student ไม่สามารถเข้าเมนูของ Admin ได้

# 9. Testing Requirements

ส่วนนี้กำหนดวิธีการทดสอบระบบ Central Authentication Service (CAS) / SSO with RADIUS

---

## 9.1 Authentication Testing

### TC-AUTH-01: Login สำเร็จ

**เงื่อนไข:**

* TODO: Username ที่ถูกต้องคือ:
* TODO: Password ที่ถูกต้องคือ:

**Expected Result:**

* [ ] Login สำเร็จ
* [ ] RADIUS ส่ง `Access-Accept`
* [ ] Central Auth สร้าง JWT
* [ ] User ถูก Redirect ไปยัง Web Application
* [ ] Web Application อนุญาตให้เข้าใช้งาน

---

### TC-AUTH-02: Username ไม่ถูกต้อง

**Input:**

* Username: TODO
* Password: TODO

**Expected Result:**

* [ ] RADIUS ส่ง `Access-Reject`
* [ ] Login ไม่สำเร็จ
* [ ] ไม่สร้าง JWT
* [ ] User ไม่สามารถเข้า Web Application ได้

---

### TC-AUTH-03: Password ไม่ถูกต้อง

**Input:**

* Username: TODO
* Password: TODO

**Expected Result:**

* [ ] Login ไม่สำเร็จ
* [ ] ไม่สร้าง JWT
* [ ] แสดง Error Message

**Error Message ที่ต้องการ:**

TODO:

---

### TC-AUTH-04: Username หรือ Password ว่าง

**Input:**

* Username: TODO
* Password: TODO

**Expected Result:**

TODO:

---

## 9.2 RADIUS Testing

### TC-RADIUS-01: RADIUS Server ทำงานปกติ

**Test:**

TODO:

**Expected Result:**

TODO:

---

### TC-RADIUS-02: RADIUS Server ไม่ทำงาน

**Test:**

TODO:

**Expected Result:**

* [ ] Login ไม่สำเร็จ
* [ ] ระบบแสดง Error
* [ ] ระบบไม่ค้าง
* [ ] มี Timeout

**Error Message:**

TODO:

---

### TC-RADIUS-03: RADIUS Timeout

**Timeout ที่ต้องการ:**

TODO: ____ seconds

**Expected Result:**

TODO:

---

### TC-RADIUS-04: RADIUS Secret ไม่ถูกต้อง

**Test:**

TODO:

**Expected Result:**

TODO:

---

## 9.3 JWT Testing

### TC-JWT-01: JWT ถูกต้อง

**Test:**

TODO:

**Expected Result:**

* [ ] Signature ถูกต้อง
* [ ] Token ยังไม่หมดอายุ
* [ ] User สามารถเข้า Web Application ได้

---

### TC-JWT-02: ไม่มี JWT

**Test:**

TODO:

**Expected Result:**

* [ ] ไม่อนุญาตให้เข้า Web Application
* [ ] Redirect ไป Central Auth

---

### TC-JWT-03: JWT หมดอายุ

**Token Expiration:**

TODO: ____ minutes / hours

**Expected Result:**

TODO:

---

### TC-JWT-04: JWT ถูกแก้ไข

**Test:**

TODO:

ตัวอย่าง:

```text
เปลี่ยน role จาก student → admin
```

**Expected Result:**

* [ ] Signature ไม่ถูกต้อง
* [ ] Token ถูกปฏิเสธ
* [ ] ไม่อนุญาตให้เข้าใช้งาน

---

### TC-JWT-05: JWT ถูกสร้างโดยระบบอื่น

**Test:**

TODO:

**Expected Result:**

TODO:

---

## 9.4 Web Application Testing

### TC-WEB-01: เข้า Web Application โดยยังไม่ได้ Login

**URL:**

TODO:

**Expected Result:**

* [ ] Redirect ไป Central Auth
* [ ] ไม่สามารถเข้าหน้า Protected Page ได้

---

### TC-WEB-02: เข้า Web Application หลัง Login สำเร็จ

**Expected Result:**

* [ ] JWT ถูกตรวจสอบ
* [ ] User สามารถเข้า Web Application
* [ ] แสดงข้อมูล User

---

### TC-WEB-03: Logout

**ต้องการ Logout หรือไม่?**

* [ ] Yes
* [ ] No

**Logout Flow:**

TODO:

**Expected Result:**

TODO:

---

### TC-WEB-04: Unauthorized Access

**User Role:**

TODO:

**Resource ที่พยายามเข้าถึง:**

TODO:

**Expected Result:**

TODO:

---

## 9.5 Role / Authorization Testing

### TC-ROLE-01: Student

**สามารถทำอะไรได้บ้าง:**

TODO:

---

### TC-ROLE-02: Teacher

**สามารถทำอะไรได้บ้าง:**

TODO:

---

### TC-ROLE-03: Admin

**สามารถทำอะไรได้บ้าง:**

TODO:

---

### TC-ROLE-04: User ไม่มีสิทธิ์

**Test:**

TODO:

**Expected Result:**

* [ ] HTTP 403
* [ ] Redirect
* [ ] แสดงข้อความ Error
* [ ] อื่น ๆ: TODO

---

## 9.6 Nginx Testing

### TC-NGINX-01: `/auth/`

**Expected Destination:**

TODO:

**Expected Result:**

TODO:

---

### TC-NGINX-02: `/lab/`

**Expected Destination:**

TODO:

**Expected Result:**

TODO:

---

### TC-NGINX-03: Invalid Route

**Test URL:**

TODO:

**Expected Result:**

TODO:

---

## 9.7 Docker Testing

### TC-DOCKER-01: Start ทุก Service

**Command:**

```bash
docker compose up -d --build
```

**Expected Services:**

* [ ] nginx
* [ ] central-auth
* [ ] freeradius
* [ ] web-app-1
* [ ] TODO: เพิ่ม Service

---

### TC-DOCKER-02: ตรวจสอบ Container

**Command:**

```bash
docker compose ps
```

**Expected Result:**

TODO:

---

### TC-DOCKER-03: Service Restart

**Test:**

TODO:

**Expected Result:**

TODO:

---

## 9.8 Database Testing

### ต้องทดสอบ Database หรือไม่?

* [ ] ไม่มี Database
* [ ] มี Database

ถ้ามี:

### TC-DB-01: Database Connection

**Expected Result:**

TODO:

### TC-DB-02: Insert Data

**Expected Result:**

TODO:

### TC-DB-03: Retrieve Data

**Expected Result:**

TODO:

### TC-DB-04: Invalid Data

**Expected Result:**

TODO:

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

* [ ] ทุกขั้นตอนทำงานสำเร็จ
* [ ] User สามารถเข้า Web Application ได้
* [ ] Password ไม่ถูกเก็บใน Web Application
* [ ] JWT สามารถตรวจสอบได้

---

## 9.10 Failure Testing

ระบบต้องสามารถรับมือกับกรณีผิดพลาดต่อไปนี้:

| Test Case         | Required | Expected Result |
| ----------------- | -------- | --------------- |
| RADIUS Down       | TODO     | TODO            |
| RADIUS Timeout    | TODO     | TODO            |
| Invalid Username  | TODO     | TODO            |
| Invalid Password  | TODO     | TODO            |
| Invalid JWT       | TODO     | TODO            |
| Expired JWT       | TODO     | TODO            |
| Missing JWT       | TODO     | TODO            |
| Nginx Down        | TODO     | TODO            |
| Central Auth Down | TODO     | TODO            |
| Web App Down      | TODO     | TODO            |
| Database Down     | TODO     | TODO            |

---

## 9.11 Performance Testing

**ต้องทดสอบ Performance หรือไม่?**

* [ ] Yes
* [ ] No

ถ้าต้องทดสอบ:

**จำนวนผู้ใช้พร้อมกัน:**

TODO: ____ users

**จำนวน Login ต่อวินาที:**

TODO: ____ requests/sec

**Maximum Response Time:**

TODO: ____ ms

---

## 9.12 Security Testing

ต้องทดสอบ:

* [ ] Password ไม่ปรากฏใน Web Application
* [ ] Password ไม่ถูกเก็บใน JWT
* [ ] JWT Signature ไม่สามารถปลอมแปลงได้
* [ ] JWT มี Expiration
* [ ] HTTPOnly Cookie
* [ ] Secure Cookie
* [ ] HTTPS
* [ ] Unauthorized User ไม่สามารถเข้าถึง Protected Resource
* [ ] User ไม่สามารถเปลี่ยน Role ใน JWT เองได้
* [ ] อื่น ๆ: TODO

---

## 9.13 Acceptance Test

ระบบจะถือว่า **ผ่าน** เมื่อ:

* [ ] User สามารถ Login ได้
* [ ] Authentication ผ่าน RADIUS
* [ ] Login สำเร็จแล้วได้รับ JWT
* [ ] Web Application ตรวจสอบ JWT ได้
* [ ] User ที่ไม่มี JWT ไม่สามารถเข้า Protected Resource
* [ ] Invalid JWT ถูกปฏิเสธ
* [ ] Expired JWT ถูกปฏิเสธ
* [ ] RADIUS Error ถูกจัดการอย่างเหมาะสม
* [ ] Docker Compose สามารถ Start ระบบได้
* [ ] Nginx สามารถ Route Request ได้
* [ ] TODO
* [ ] TODO
* [ ] TODO

---

## 9.14 Test Environment

**Operating System:**

TODO:

**Docker Version:**

TODO:

**Docker Compose Version:**

TODO:

**Browser:**

TODO:

**Browser Version:**

TODO:

**Testing URL:**

TODO:

**Other Requirements:**

TODO:
