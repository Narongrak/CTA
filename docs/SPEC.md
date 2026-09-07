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
- ระบบนี้สร้างขึ้นเพื่อแก้ปัญหาอะไร?
- ต้องการให้ผู้ใช้สามารถทำอะไรได้?
- เป้าหมายหลักของระบบคืออะไร?

---

## 1.3 Scope

TODO:
- ระบบครอบคลุมอะไรบ้าง?
- ระบบไม่ครอบคลุมอะไรบ้าง?
- ต้องมี Web Application กี่ตัว?
- ต้องมีระบบ Login แบบใด?

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
- ต้องการเพิ่ม Component อื่นหรือไม่?
- ต้องมี Database หรือไม่?
- ถ้ามี Database ใช้:
  - MySQL / PostgreSQL / อื่น ๆ:
- ต้องมี Web Application กี่ระบบ?

---

## 2.2 Component Responsibilities

### Client

TODO:
- ผู้ใช้สามารถทำอะไรได้บ้าง?
- Login ผ่านหน้าไหน?
- ต้องรองรับ Browser อะไรบ้าง?

### Nginx

TODO:
- ต้องทำหน้าที่อะไร?
- ต้อง Route URL อะไรบ้าง?

ตัวอย่าง:
- `/auth/` → Central Auth
- `/lab/` → Web App

ต้องการ URL อื่นหรือไม่:

TODO:

### Central Authentication Service

TODO:
- Login ด้วย Username/Password หรือวิธีอื่น?
- ติดต่อ RADIUS อย่างไร?
- หลัง Login สำเร็จต้องทำอะไร?
- หลัง Login ไม่สำเร็จต้องทำอะไร?
- ต้องสร้าง JWT หรือ Session?
- JWT ต้องมีข้อมูลอะไรบ้าง?

### RADIUS Server

TODO:
- ใช้ FreeRADIUS หรือไม่?
- ใช้ Authentication แบบใด?
- User ถูกเก็บไว้ที่ไหน?
- ต้องมี User กี่คนสำหรับ Demo?
- ต้องรองรับการเพิ่ม User หรือไม่?

### Web Application

TODO:
- Web App มีไว้ทำอะไร?
- ต้องมี Feature อะไร?
- ต้องตรวจสอบ JWT อย่างไร?
- ต้องมี Role/Permission หรือไม่?

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
- Flow ต้องเปลี่ยนจากนี้หรือไม่?
- ต้องมี Logout หรือไม่?
- Logout ต้องทำอย่างไร?
- Token หมดอายุหลังจากกี่นาที/ชั่วโมง?
- เมื่อ Token หมดอายุให้ทำอะไร?

---

# 4. Authentication

## 4.1 Username

TODO:
- รูปแบบ Username:
- ตัวอย่าง Username:

## 4.2 Password

TODO:
- Password มีข้อกำหนดอะไร?
- Minimum length:
- ต้องมีตัวเลขหรือไม่?
- ต้องมีตัวอักษรพิเศษหรือไม่?

## 4.3 RADIUS

TODO:
- RADIUS Host:
- RADIUS Port:
- RADIUS Secret:
- Authentication Method:
- Timeout:
- Retry:

---

# 5. JWT Specification

## 5.1 Token Type

TODO:
- JWT / Session / อื่น ๆ:

## 5.2 JWT Payload

ปัจจุบันระบบมี:

```json
{
  "sub": "username",
  "role": "student"
}
```

---

# 6 Roles

## 6.1 Roles Require

TODO:
ระบบมี Role อะไรบ้าง?

ตัวอย่าง:

Student
Teacher
Admin

รายการ Role จริง:

TODO:

## 6.2 Roles Permission

TODO:
แต่ละ Roles ทำอะไรได้บ้าง

ตัวอย่าง:

| Role    | Permission     |
| ------- | -------------- |
| Student | View / Reserve |
| Teacher | View / Manage  |
| Admin   | Full Access    |

แก้ไขตามระบบจริง:

TODO:

| Role    | Permission     |
| ------- | -------------- |
| Student | View / Reserve |
| Teacher | View / Manage  |
| Admin   | Full Access    |

# 7 Database

## 7.1 Database Require

ใช้อะไรทำ Database:

TODO:

## 7.2 Database Purpose

ใช้เก็บอะไรใน Database:

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

TODO:

| Column   | Type    | Description |
| -------- | ------- | ----------- |
| id       | INT     | User ID     |
| username | VARCHAR | Username    |
| role     | VARCHAR | User Role   |

# 8 Error Handling

TODO:

กรณีต่าง ๆ ต้องแสดงผลอย่างไร?

Invalid Username / Password

TODO:

RADIUS Server Down

TODO:

RADIUS Timeout

TODO:

Invalid JWT

TODO:

Expired JWT

TODO:

Unauthorized User

TODO:

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
