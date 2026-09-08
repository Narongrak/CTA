# 1. Project Summary

TODO:
ระบบนี้เป็นเว็บแอปพลิเคชันสำหรับการตรวจสอบผลการเรียนของนักศึกษาที่มีการจัดการสิทธิ์การเข้าถึงตามบทบาทของผู้ใช้งาน (Role-Based Access Control)
ระบบทำหน้าที่เป็นแพลตฟอร์มกลางในการจัดการข้อมูลการศึกษาและการยืนยันตัวตนของผู้ใช้แต่ละกลุ่ม เช่น นักศึกษา อาจารย์ และผู้ดูแลระบบ
ผู้ใช้งานสามารถเข้าสู่ระบบเพียงครั้งเดียวและคงสถานะการเข้าใช้งานไว้ได้อย่างต่อเนื่องจนกว่าจะทำการกด Log out
ระบบใช้กลไกการจัดการ Session หรือ Token ที่ปลอดภัยเพื่อรักษาความลับของข้อมูลนักศึกษาและอำนวยความสะดวกในการใช้งานโดยไม่ต้องล็อกอินซ้ำซ้อน

ตัวอย่างโครงสร้าง:

ระบบนี้เป็นระบบ Central Authentication Service สำหรับ...
ระบบทำหน้าที่เป็นตัวกลางระหว่าง...
ผู้ใช้สามารถ Login เพียงครั้งเดียวและสามารถ...
ระบบใช้ RADIUS สำหรับตรวจสอบตัวตน และใช้ JWT สำหรับ...


---

# 2. Problem

TODO:
ปัญหาที่ Project นี้ต้องการแก้คืออะไร?

ตัวอย่าง:

- แต่ละ Web Application มีระบบ Login แยกกัน
- User ต้อง Login หลายครั้ง
- Web Application ไม่ควรเก็บ Password ของ User
- ต้องการ Authentication แบบ Centralized

แก้ไขให้ตรงกับ Project จริง:

TODO:
- แต่ละ Web Application มีระบบ Login แยกกัน
- User ต้อง Login หลายครั้ง
- Web Application ไม่ควรเก็บ Password ของ User
- ต้องการ Authentication แบบ Centralized
- สิทธิ์การเข้าถึงข้อมูลผลการเรียน (Grade) ของผู้ใช้งานแต่ละ Role (เช่น นักศึกษา, อาจารย์, เจ้าหน้าที่) แตกต่างกันอย่างสิ้นเชิง
- ข้อมูลผลการเรียนของนักศึกษาเป็นข้อมูลที่มีความสำคัญและอ่อนไหว จำเป็นต้องมีกลไกการควบคุมสิทธิ์ (Authorization) และป้องกันการเข้าถึงโดยไม่ได้รับอนุญาตที่รัดกุม
---

# 3. Goal

สามารถเข้าใช้งานWeb Applicationได้จริงมีการเเยกเเยะสิทธิของเเต่ละUserว่ามีสิทธิทำอะไรได้บ้างในเเต่ละrole

เป้าหมายของ Project

- ทุก User สามารถเข้ามาในปฏิทินการศึกษาได้
- ทุก Buttom สามารถใช้งานได้จริง เช่น กดปุ่มเกรดตัวเองจะพาไปยังหน้าเกรด หรือกดปุ่ม ยืนยัน ในหน้าLogin จะส่งข้อมูลไปเก็บที่Database
- Student สามารถเข้ามาดูข้อมูลเกรดส่วนตัวได้โดย Student คนอื่นที่ไม่ใช่เจ้าของข้อมูลเข้ามาดูไม่ได้
- Teacher สามารถใส่เกรดหรือข้อมูลได้เเค่ในวิชาที่ตัวเองรับผิดชอบพร้อมทั้งดูเกรด Student ทั้งหมดได้
- Admin มีสิทธิเเก้ไขเเละดูข้อมูลของทุกUserพร้อมทั้งดูประวัติการเเก้ไขของ User ต่างๆได้ใน Web Application
- มีการบันทึกข้อมูล User ไว้ในDatabase เเละจดจำเพื่อไม่ให้เมื่อออกจากซอฟเเวร์เเล้วเข้าใหม่ต้องLogin เครื่องเดิมใหม่


---

# 4. Target Users

- Student
- Teacher
- Admin


ระบบนี้มีผู้ใช้งานประเภทใดบ้าง?

ตัวอย่าง:

- Student
- Teacher
- Admin

รายละเอียด:
 
 Student จะมีเเค่สิทธิดูข้อมูลเกรดของตัวเองอย่างเดียว 
 Teacher สามารถใส่เกรดหรือข้อมูลได้เเค่ในวิชาที่ตัวเองรับผิดชอบ
 Admin มีสิทธิเเก้ไขเเละเก็บข้อมูลการเปลี่ยนเเปลงเเละเข้าถึงทุกข้อมูลได้

---

# 5. Main Features

TODO:

ระบบต้องมี Feature อะไรบ้าง?

ตัวอย่าง:

- Central Login
- RADIUS Authentication
- JWT Authentication
- Single Sign-On
- Logout
- Role-based Authorization
- Web Application
- Reverse Proxy

รายการ Feature จริง:

TODO:


---

# 6. System Components

ระบบประกอบด้วย:

| Component | Responsibility |
|---|---|
| Nginx | TODO |
| Central Auth | TODO |
| RADIUS | TODO |
| Web App | TODO |
| Database | TODO |

เพิ่ม Component ถ้ามี:

TODO:


---

# 7. User Flow

TODO:

อธิบาย User Flow แบบสั้น ๆ

ตัวอย่าง:

```text
User
  ↓
Web Application
  ↓
Check JWT
  ↓
Not Authenticated
  ↓
Central Auth
  ↓
RADIUS
  ↓
Authentication Success
  ↓
JWT
  ↓
Web Application
```

อ่านไฟล์ User Flow จาก:
TODO:(File Name)

# 8. Technology Stack

กำหนด Technology ที่ต้องการใช้ใน Project

## 8.1 Frontend

**Technology:**

TODO:

* เช่น HTML / CSS / JavaScript / React / อื่น ๆ

**UI Framework / Library:**

TODO:

---

## 8.2 Backend

**Programming Language:**

TODO:

* เช่น JavaScript / TypeScript / Python

**Framework:**

TODO:

* เช่น Express / FastAPI / อื่น ๆ

---

## 8.3 Authentication

**Authentication Server:**

* [ ] FreeRADIUS
* [ ] อื่น ๆ: TODO

**Authentication Protocol:**

* [ ] RADIUS
* [ ] อื่น ๆ: TODO

**Token / Session:**

* [ ] JWT
* [ ] Session
* [ ] อื่น ๆ: TODO

---

## 8.4 Reverse Proxy

**Reverse Proxy:**

* [ ] Nginx
* [ ] อื่น ๆ: TODO

**หน้าที่ของ Reverse Proxy:**

TODO:

---

## 8.5 Containerization

**Container Platform:**

* [ ] Docker
* [ ] อื่น ๆ: TODO

**Orchestration:**

* [ ] Docker Compose
* [ ] อื่น ๆ: TODO

---

## 8.6 Database

**Database:**

* [ ] ไม่มี Database
* [ ] MySQL
* [ ] PostgreSQL
* [ ] MongoDB
* [ ] อื่น ๆ: TODO

**Database ใช้สำหรับ:**

TODO:

---

## 8.7 Other Technologies

TODO:

มี Technology อื่นที่ต้องใช้หรือไม่?

* TODO
* TODO
* TODO

# 9. Requirements

## 9.1 Functional Requirements

กำหนดสิ่งที่ระบบ "ต้องสามารถทำได้"

### Authentication

**FR-01 — User Login**

TODO:
ผู้ใช้ต้องสามารถ...

**FR-02 — RADIUS Authentication**

TODO:
Central Auth ต้อง...

**FR-03 — JWT / Session**

TODO:
หลังจาก Login สำเร็จ ระบบต้อง...

**FR-04 — Redirect**

TODO:
หลังจาก Authentication สำเร็จ ระบบต้อง...

**FR-05 — Logout**

TODO:
ผู้ใช้สามารถ...

---

### Web Application

**FR-06 — Web Application Access**

TODO:

**FR-07 — Protected Resource**

TODO:

**FR-08 — User Information**

TODO:

---

### Authorization

**FR-09 — Role**

TODO:

ระบบต้องรองรับ Role:

* TODO
* TODO
* TODO

**FR-10 — Permission**

TODO:

แต่ละ Role สามารถทำอะไรได้บ้าง?

---

### Nginx

**FR-11 — Reverse Proxy**

TODO:

Nginx ต้อง Route:

```text
/auth/ → TODO
/lab/  → TODO
```

**FR-12 — Request Handling**

TODO:

---

### Error Handling

**FR-13 — Authentication Error**

TODO:

**FR-14 — RADIUS Error**

TODO:

**FR-15 — Invalid Token**

TODO:

---

## 9.2 Non-Functional Requirements

กำหนดคุณสมบัติของระบบที่ไม่ใช่ Feature โดยตรง

### Security

**NFR-01**

TODO:

ตัวอย่าง:
Password ต้องไม่ถูกเก็บใน Web Application

**NFR-02**

TODO:

ตัวอย่าง:
JWT ต้องมี Signature และ Expiration

**NFR-03**

TODO:

ตัวอย่าง:
Authentication ต้องดำเนินการผ่าน Central Auth

---

### Performance

**NFR-04**

TODO:

ระบบควรตอบสนองภายใน:

`TODO ms`

**NFR-05**

TODO:

ระบบต้องรองรับผู้ใช้พร้อมกัน:

`TODO users`

---

### Availability

**NFR-06**

TODO:

ระบบต้องสามารถทำงานต่อเนื่อง / Restart ได้อย่างไร?

---

### Maintainability

**NFR-07**

TODO:

ต้องการให้ระบบสามารถ:

* [ ] เพิ่ม Web Application ได้ง่าย
* [ ] เพิ่ม User ได้ง่าย
* [ ] เพิ่ม Role ได้ง่าย
* [ ] เปลี่ยน Configuration ได้ง่าย
* [ ] อื่น ๆ: TODO

# 10. Expected Result

เมื่อ Project เสร็จสมบูรณ์ ระบบควรสามารถทำงานตาม Flow ต่อไปนี้:

```text
User
  ↓
Web Application
  ↓
Check Authentication
  ↓
Not Authenticated
  ↓
Central Authentication Service
  ↓
Username / Password
  ↓
RADIUS Server
  ↓
Authentication Result
  ↓
JWT / Session
  ↓
Web Application
  ↓
Verify Authentication
  ↓
Access Granted
```

## 10.1 Login Success

เมื่อ User Login ด้วยข้อมูลที่ถูกต้อง:

TODO:

ตัวอย่าง:

1. User กรอก Username / Password
2. Central Auth ส่งข้อมูลไป RADIUS
3. RADIUS ส่ง `Access-Accept`
4. Central Auth สร้าง JWT
5. User ถูก Redirect กลับ Web Application
6. Web Application ตรวจสอบ JWT
7. User สามารถเข้าใช้งานระบบได้

---

## 10.2 Login Failure

เมื่อ User Login ด้วยข้อมูลที่ไม่ถูกต้อง:

TODO:

ตัวอย่าง:

1. User กรอก Username / Password
2. Central Auth ส่งข้อมูลไป RADIUS
3. RADIUS ส่ง `Access-Reject`
4. Central Auth ไม่สร้าง JWT
5. User ไม่สามารถเข้า Protected Resource ได้

---

## 10.3 Unauthorized Access

กรณี User ไม่มี Authentication หรือ JWT ไม่ถูกต้อง:

TODO:

ระบบควร:

* [ ] Redirect ไป Login
* [ ] แสดง `401 Unauthorized`
* [ ] แสดง Error Page
* [ ] อื่น ๆ: TODO

---

## 10.4 Expected System State

หลังจากระบบ Start สำเร็จ:

**Services ที่ต้องทำงาน:**

* [ ] Nginx
* [ ] Central Auth
* [ ] FreeRADIUS
* [ ] Web App
* [ ] Database
* [ ] TODO

**Expected URL:**

```text
http://localhost/        → TODO
http://localhost/auth/   → TODO
http://localhost/lab/    → TODO
```

---

## 10.5 Final Acceptance

Project ถือว่าสำเร็จเมื่อ:

* [ ] Docker Compose สามารถ Start ทุก Service
* [ ] Nginx สามารถ Route Request
* [ ] User สามารถ Login
* [ ] Central Auth สามารถติดต่อ RADIUS
* [ ] RADIUS สามารถตรวจสอบ User
* [ ] Login สำเร็จได้รับ JWT / Session
* [ ] Web Application สามารถตรวจสอบ JWT / Session
* [ ] User ที่ไม่ได้ Authentication ไม่สามารถเข้า Protected Resource
* [ ] Logout สามารถทำงานได้
* [ ] TODO
* [ ] TODO

# 11. Limitations

ระบุข้อจำกัดของ Project ใน Version ปัจจุบัน

## 11.1 Technical Limitations

TODO:

ตัวอย่าง:

* ระบบทำงานภายใน Local Network
* ยังไม่ได้ Deploy บน Production Server
* ใช้ HTTP แทน HTTPS ใน Development
* RADIUS User ใช้ข้อมูลสำหรับ Demo

---

## 11.2 Authentication Limitations

TODO:

ตัวอย่าง:

* รองรับเฉพาะ Username / Password
* ยังไม่มี Multi-Factor Authentication (MFA)
* ยังไม่มี Password Reset
* ยังไม่มี Account Recovery

---

## 11.3 Application Limitations

TODO:

ตัวอย่าง:

* มี Web Application เพียง 1 ระบบ
* Feature ของ Web Application จำกัดเฉพาะการทดสอบ SSO
* ยังไม่มีระบบจัดการ User ผ่านหน้าเว็บ

---

## 11.4 Database Limitations

**มี Database หรือไม่:**

* [ ] ไม่มี
* [ ] มี

ถ้ามี:

TODO:
ระบุข้อจำกัด เช่น

* ยังไม่มี Backup
* ยังไม่มี Database Replication
* ใช้ Database สำหรับ Development เท่านั้น

---

## 11.5 Security Limitations

TODO:

ตัวอย่าง:

* Development Environment ใช้ HTTP
* Secret ถูกกำหนดผ่าน Environment Variable
* ยังไม่มีระบบ Security Monitoring
* ยังไม่มี Rate Limiting
* ยังไม่มี MFA

---

## 11.6 Deployment Limitations

TODO:

ระบบปัจจุบันสามารถ Deploy ได้ที่:

* [ ] Local Machine
* [ ] VM
* [ ] Local Network
* [ ] Cloud
* [ ] อื่น ๆ: TODO

ข้อจำกัด:

TODO:

---

## 11.7 Known Issues

ปัญหาที่ทราบใน Version ปัจจุบัน:

* TODO
* TODO
* TODO

---

## 11.8 Out of Scope

สิ่งที่ **ไม่อยู่ในขอบเขตของ Project นี้**:

* TODO
* TODO
* TODO
