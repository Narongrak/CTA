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
- Central Login
- RADIUS Authentication
- JWT Authentication
- Single Sign-On
- Logout
- Role-based Authorization
- Web Application
- Reverse Proxy
- Action Trigger

รายการ Feature จริง:

TODO:
- Central Login
- RADIUS Authentication
- JWT Authentication
- Single Sign-On
- Logout
- Role-based Authorization
- Web Application
- Reverse Proxy
- Action Trigger

---

# 6. System Components

ระบบประกอบด้วย:

| Component | Responsibility |
|---|---|
| Nginx | ทำหน้าที่เป็น Reverse Proxy เพื่อรับ Request จากผู้ใช้, จัดการเรื่องความปลอดภัยและส่งต่อ Traffic ไปยัง Web App หรือ Central Auth |
| Central Auth | จัดการระบบยืนยันตัวตนและการออก Token หรือจัดการ Session เพื่อรองรับระบบ "ล็อกอินครั้งเดียวไม่ต้องเข้าซ้ำ" สำหรับผู้ที่ต้องการเข้ามาดูเกรดและปฏิทินการศึกษา |
| RADIUS | ทำหน้าที่เชื่อมต่อกับฐานข้อมูลกลางเพื่อตรวจสอบบัญชีผู้ใช้ของนักศึกษาในขั้นตอนการล็อกอินครั้งแรก |
| Web App | แอปพลิเคชันหลักสำหรับดึงข้อมูลและแสดงผลโดยจะตรวจสอบสถานะการล็อกอินจาก Token/Session ก่อนอนุญาตให้เข้าถึงข้อมูล |
| Database | ฐานข้อมูลหลักของระบบ ใช้เก็บข้อมูลปฏิทินการศึกษา, ข้อมูลผู้ใช้งานเบื้องต้น, แคชข้อมูลเกรดและประวัติการเข้าใช้งาน |
| Redis | ใช้เก็บข้อมูล Session หรือ Refresh Token เพื่อให้ระบบสามารถจดจำสถานะการล็อกอินของผู้ใช้ได้อย่างมีประสิทธิภาพและรวดเร็ว ช่วยให้ผู้ใช้ไม่ต้องล็อกอินซ้ำเป็นครั้งที่ 2 |
| University API | ระบบ API กลางของมหาวิทยาลัยสำหรับดึงข้อมูลเกรดของนักศึกษาและข้อมูลปฏิทินการศึกษาล่าสุดเพื่อนำมาแสดงผลใน Web App |


---

# 7. User Flow

TODO:
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

TODO:JavaScript

* เช่น HTML / CSS / JavaScript / React / อื่น ๆ

**UI Framework / Library:**

TODO:Tailwind CSS

---

## 8.2 Backend

**Programming Language:**

TODO:TypeScript

* เช่น JavaScript / TypeScript / Python

**Framework:**

TODO:FastAPI

* เช่น Express / FastAPI / อื่น ๆ

---

## 8.3 Authentication

**Authentication Server:**

* [x] FreeRADIUS
* [x] Central Auth API

**Authentication Protocol:**

* [x] RADIUS

**Token / Session:**

* [x] JWT
* [x] Refresh Token

---

## 8.4 Reverse Proxy

**Reverse Proxy:**

* [x] Nginx

**หน้าที่ของ Reverse Proxy:**

TODO:
- เป็นด่านหน้าคอยรับ HTTP/HTTPS Request จากผู้ใช้ทั้งหมด
- จัดการเรื่องความปลอดภัยด้าน SSL/TLS Certificate (HTTPS)
- จัดการ Routing traffic
- เสิร์ฟไฟล์ Static ของเว็บ Frontend

---

## 8.5 Containerization

**Container Platform:**

* [x] Docker

**Orchestration:**

* [x] Docker Compose

---

## 8.6 Database

**Database:**

* [ ] ไม่มี Database
* [ ] MySQL
* [x] PostgreSQL
* [ ] MongoDB


**Database ใช้สำหรับ:**

TODO:
- เก็บข้อมูล "ปฏิทินการศึกษา"
- เก็บ "Refresh Token" เพื่อตรวจสอบและจดจำสถานะการล็อกอินของผู้ใช้ในระยะยาว
- เก็บข้อมูลโปรไฟล์ผู้ใช้เบื้องต้น
- ทำเป็น Cache เก็บข้อมูล "เกรด" ชั่วคราว

---

## 8.7 Other Technologies

* [x] Redis: ใช้สำหรับเก็บ Cache เพื่อให้ดึงข้อมูลปฏิทินการศึกษาได้เร็วขึ้น และใช้จัดการ Blacklist/Whitelist ของ Token
* [x] Axios: ใช้สำหรับให้ฝั่งเว็บส่ง Request แนบ JWT ไปขอข้อมูลจาก Backend
* [x] University API: ระบบ API ปลายทางที่ Backend ของเราต้องไปดึงข้อมูลเกรดจริงมาแสดงผล

# 9. Requirements

## 9.1 Functional Requirements

กำหนดสิ่งที่ระบบ "ต้องสามารถทำได้"

### Authentication

**FR-01 — User Login**

TODO:
ผู้ใช้ต้องสามารถกรอก Username และ Password ผ่านหน้า Login ของระบบเพื่อยืนยันตัวตนได้

**FR-02 — RADIUS Authentication**

TODO:
Central Auth ต้องนำ Username และ Password ที่ผู้ใช้กรอก ไปตรวจสอบความถูกต้องกับฐานข้อมูลผู้ใช้ของสถาบันผ่านโปรโตคอล RADIUS

**FR-03 — JWT / Session**

TODO:
หลังจาก Login สำเร็จ ระบบต้องสร้าง Access JWT และ Refresh Token และส่งกลับไปให้เบราว์เซอร์เก็บไว้

**FR-04 — Redirect**

TODO:
หลังจาก Authentication สำเร็จ ระบบต้อง Redirect ผู้ใช้ไปยังหน้า Dashboard หลัก เพื่อดูเกรดและปฏิทินการศึกษา

**FR-05 — Logout**

TODO:
ผู้ใช้สามารถกดปุ่ม Logout เพื่อออกจากระบบ โดยระบบจะต้องทำการลบ JWT และระงับ Refresh Token ออกจากฐานข้อมูล เพื่อไม่ให้ถูกนำมาใช้ซ้ำได้

---

### Web Application

**FR-06 — Web Application Access**

TODO:
ระบบต้องสามารถแสดงผล เกรด (Grades) ของนักศึกษาแต่ละคน และ ปฏิทินการศึกษา (Academic Calendar) ได้อย่างถูกต้องและเป็นระเบียบ

**FR-07 — Protected Resource**

TODO:
ข้อมูลเกรดถือเป็นข้อมูลส่วนบุคคล ระบบต้องอนุญาตให้เข้าถึงได้เฉพาะผู้ใช้ที่มี Access JWT ที่ถูกต้องเท่านั้น หากไม่มี Token ระบบต้องปฏิเสธการเข้าถึง

**FR-08 — User Information**

TODO:
ระบบต้องดึงข้อมูลเบื้องต้นของผู้ใช้งานจาก Token หรือ Database มาแสดงผลที่แถบเมนูได้

---

### Authorization

**FR-09 — Role**

TODO:

ระบบต้องรองรับ Role:

* Student: นักศึกษาทั่วไปที่เข้ามาดูเกรดและปฏิทิน
* Teacher: สามารถใส่เกรดหรือข้อมูลได้เเค่ในวิชาที่ตัวเองรับผิดชอบ
* Admin: เจ้าหน้าที่หรือผู้ดูแลระบบที่เข้ามาจัดการข้อมูลส่วนกลาง

**FR-10 — Permission**

TODO:

แต่ละ Role สามารถทำอะไรได้บ้าง?

Student: ดูเกรดของตนเองได้เท่านั้น, ดูปฏิทินการศึกษาได้
Teacher: สามารถใส่เกรด, ข้อมูลได้เเค่ในวิชาที่ตัวเองรับผิดชอบ, สามารถดูเกรดของนักศึกษาได้
Admin: ไม่สามารถดูเกรดผู้อื่นได้ (เว้นแต่ได้รับสิทธิ์พิเศษ), สามารถเพิ่ม/ลบ/แก้ไขข้อมูลปฏิทินการศึกษาใน Database ได้

---

### Nginx

**FR-11 — Reverse Proxy**

TODO:

Nginx ต้อง Route:

```text
/auth/ → Central Auth Service
/api/  → Web App Backend
/      → Frontend Web Application
```

**FR-12 — Request Handling**

TODO:
Nginx ต้องรองรับการเชื่อมต่อแบบ HTTPS และคอย Forward Header ที่สำคัญไปยัง Backend ได้อย่างถูกต้อง

---

### Error Handling

**FR-13 — Authentication Error**

TODO:
หากผู้ใช้กรอกรหัสผ่านผิด ระบบต้องแสดงข้อความแจ้งเตือนที่ชัดเจนโดยไม่แจ้งรายละเอียดทางเทคนิคเพื่อป้องกันความปลอดภัย

**FR-14 — RADIUS Error**

TODO:
หากการเชื่อมต่อระหว่าง Central Auth กับ RADIUS ล้มเหลวหรือ Timeout ระบบต้องแสดงข้อความแจ้งเตือน

**FR-15 — Invalid Token**

TODO:
หาก Access JWT หมดอายุ ระบบต้องทำการร้องขอ Token ใหม่ผ่าน Refresh Token เบื้องหลัง เพื่อให้ผู้ใช้ไม่ต้องล็อกอินใหม่ แต่ถ้า Refresh Token หมดอายุหรือถูกยกเลิกด้วย ระบบถึงจะบังคับ Redirect กลับไปหน้า Login

---

## 9.2 Non-Functional Requirements

กำหนดคุณสมบัติของระบบที่ไม่ใช่ Feature โดยตรง

### Security

**NFR-01**

TODO:
Password ต้องไม่ถูกเก็บใน Web Application และ Database ของระบบเราโดยเด็ดขาด รหัสผ่านต้องถูกส่งไปตรวจสอบที่ RADIUS และลบทิ้งจากหน่วยความจำทันที


**NFR-02**

TODO:
JWT ต้องมี Signature ควบคุมความถูกต้องและต้องมีการตั้ง Expiration Time เสมอ เพื่อป้องกันการขโมย Token


**NFR-03**

TODO:
Authentication ต้องดำเนินการผ่าน Central Auth เท่านั้น Web App ห้ามมีช่องทาง Login หรือตรวจสอบผู้ใช้ด้วยตนเอง


---

### Performance

**NFR-04**

TODO:
500 ms สำหรับการเปิดหน้าเว็บทั่วไป และดึงข้อมูลปฏิทินการศึกษา

`TODO ms`

**NFR-05**

TODO:
500 - 1,000 users โดยระบบต้องไม่ล่ม

`TODO users`

---

### Availability

**NFR-06**

TODO:
ใช้ Docker Compose ในการรัน Service ทั้งหมด และต้องกำหนดนโยบาย restart: always เพื่อให้ Container สามารถเปิดตัวเองขึ้นมาใหม่ได้ทันทีในกรณีที่ระบบล่ม หรือเซิร์ฟเวอร์หลักมีการรีสตาร์ท

---

### Maintainability

**NFR-07**

TODO:
[x] เพิ่ม Web Application ได้ง่าย
[x] เพิ่ม User ได้ง่าย
[x] เพิ่ม Role ได้ง่าย
[x] เปลี่ยน Configuration ได้ง่าย
[x] ง่ายต่อการจัดการข้อมูลปฏิทินการศึกษา ด้วยโครงสร้าง Database แบบ Relational


# 10. Expected Result

User
  ↓
Web Application
  ↓
Check Authentication
  ↓
Not Authenticated / Token Expired
  ↓
Central Authentication Service
  ↓
Username / Password
  ↓
RADIUS Server
  ↓
Authentication Result
  ↓
JWT
  ↓
Web Application
  ↓
Verify Authentication
  ↓
Access Granted

## 10.1 Login Success

TODO:
1. User กรอก Username / Password ผ่านหน้าเว็บ
2. Central Auth รับข้อมูลและส่งไปตรวจสอบที่ RADIUS Server
3. RADIUS ตรวจสอบสำเร็จและส่งสัญญาณ 'Access-Accept' กลับมา
4. Central Auth สร้าง Access JWT และ Refresh Token
5. User ถูก Redirect กลับมาที่หน้า Web Application
6. Web Application รับ Token มาบันทึกไว้ในระบบและตรวจสอบความถูกต้อง
7. User สามารถเข้าดูเกรดและปฏิทินการศึกษาได้ และเมื่อปิดเว็บแล้วกลับมาใหม่ ระบบจะดึงข้อมูลมาแสดงได้ทันทีโดยไม่ต้องให้ผู้ใช้ล็อกอินซ้ำอีก


## 10.2 Login Failure


TODO:
1. User กรอก Username / Password ผ่านหน้าเว็บ
2. Central Auth รับข้อมูลและส่งไปตรวจสอบที่ RADIUS Server
3. RADIUS พบว่ารหัสผ่านไม่ตรง จึงส่งสัญญาณ Access-Reject กลับมา
4. Central Auth ระงับการสร้าง Token ทั้งหมด
5. ระบบแสดงข้อความแจ้งเตือนแก่ผู้ใช้
6. User ไม่สามารถเข้าถึง Protected Resource ได้ และยังคงอยู่ที่หน้า Login


---

## 10.3 Unauthorized Access

TODO:
[x] Redirect ไป Login
[x] แสดง 401 Unauthorized
[ ] แสดง Error Page
[x] หาก Access JWT หมดอายุ แต่ระบบพบว่ามี Refresh Token ที่ยังใช้งานได้อยู่ ระบบจะทำงานเบื้องหลัง เพื่อขอ Access JWT ใหม่โดยอัตโนมัติ เพื่อให้ผู้ใช้งานยังคงดูข้อมูลได้โดยไม่รู้สึกสะดุดและไม่ต้องล็อกอินใหม่
---

## 10.4 Expected System State

หลังจากระบบ Start สำเร็จ:

**Services ที่ต้องทำงาน:**

[x] Nginx
[x] Central Auth
[x] FreeRADIUS
[x] Web App
[x] Database
[x] Redis
**Expected URL:**

```text
http://localhost/        → หน้า Dashboard ของ Web App (ดูเกรด / ปฏิทิน หากยังไม่ล็อกอินจะถูกพาไปหน้า auth)
http://localhost/auth/   → หน้า Central Auth สำหรับจัดการการ Login และออก Token
http://localhost/api/    → Web App Backend (API หลักที่ให้สิทธิ์ดึงข้อมูลเกรดและปฏิทิน)
```

---

## 10.5 Final Acceptance

Project ถือว่าสำเร็จเมื่อ:

* [x] Docker Compose สามารถ Start ทุก Service ได้โดยไม่พบ Error
* [x] Nginx สามารถ Route Request ไปยัง Service ต่างๆ ได้อย่างถูกต้อง
* [x] User สามารถ Login ผ่านหน้าต่างของ Central Auth ได้
* [x] Central Auth สามารถติดต่อ RADIUS ได้อย่างสมบูรณ์
* [x] RADIUS สามารถตรวจสอบ User และ Password จากฐานข้อมูลจำลองได้
* [x] Login สำเร็จได้รับ Access JWT และ Refresh Token กลับมาที่เบราว์เซอร์
* [x] Web Application สามารถตรวจสอบ JWT เพื่อเข้าถึงข้อมูลได้
* [x] User ที่ไม่ได้ Authentication ไม่สามารถแอบเข้าหน้าดูเกรดได้
* [x] Logout สามารถทำงานได้ (ลบและทำลาย Token ทั้งหมด)
* [x] ระบบสามารถจดจำการล็อกอิน (Remember Me) ได้ ผู้ใช้ปิดเบราว์เซอร์แล้วเปิดใหม่ สามารถเข้าหน้าดูเกรดได้เลยโดยไม่ต้องล็อกอินครั้งที่ 2
* [x] Web Application สามารถดึงและแสดงผล "ข้อมูลเกรด" และ "ปฏิทินการศึกษา" ได้อย่างถูกต้องและสวยงาม

# 11. Limitations

ระบุข้อจำกัดของ Project ใน Version ปัจจุบัน

## 11.1 Technical Limitations

TODO:
* ระบบทำงานภายใน Local Network และ Container บนเครื่องสำหรับการพัฒนา
* ยังไม่ได้ Deploy ขึ้นระบบ Production Server จริงของมหาวิทยาลัย
* การรันบน Development Environment ยังใช้โปรโตคอล HTTP แทน HTTPS
* ข้อมูลนักศึกษา ข้อมูลเกรดใน Database และบัญชีผู้ใช้ใน RADIUS เป็นเพียงข้อมูลจำลองสำหรับใช้ในการทดสอบระบบเท่านั้น

---

## 11.2 Authentication Limitations

TODO:
* รองรับการยืนยันตัวตนผ่าน Username / Password ตามมาตรฐาน RADIUS เท่านั้น
* ยังไม่มีระบบ Multi-Factor Authentication (MFA) เช่น OTP หรือ Authenticator App
* ไม่มีระบบ Password Reset / Account Recovery ภายในเว็บนี้

---

## 11.3 Application Limitations

TODO:
* ฟีเจอร์หลักเน้นไปที่การ "ดูเกรด" และ "ดูปฏิทินการศึกษา" เท่านั้น
* ไม่สามารถใช้ระบบนี้ในการลงทะเบียนเรียน เพิ่ม-ถอนรายวิชา หรือชำระค่าธรรมเนียมการศึกษาได้
* ระบบหลังบ้านสำหรับจัดการข้อมูลปฏิทินการศึกษายังมีฟังก์ชันพื้นฐานที่จำกัด

---

## 11.4 Database Limitations

**มี Database หรือไม่:**

* [ ] ไม่มี
* [x] มี

ถ้ามี:

TODO:
* ระบบ Database ยังเป็นแบบ Single Node ไม่มี Database Replication
* ยังไม่มีระบบ Automated Backup สำหรับสำรองข้อมูล
* Database ในเวอร์ชันนี้ตั้งค่าทรัพยากรไว้สำหรับ Development เท่านั้น หากนำไปใช้บน Production ต้องปรับจูน (Tuning) เพิ่มเติม
---

## 11.5 Security Limitations

TODO:
* Development Environment ใช้ HTTP ซึ่งอาจเสี่ยงต่อการถูกดักจับข้อมูล (Packet Sniffing) หากนำไปเปิด Public โดยไม่ใส่ Nginx SSL
* คีย์สำคัญ (Secret Keys, JWT Secret, DB Password) ถูกกำหนดผ่านไฟล์ Environment Variable (.env) แบบ Plain text (ยังไม่ได้ใช้ Key Vault หรือ Secret Manager)
* ยังไม่มีระบบ Security Monitoring หรือ Alert เมื่อมีการพยายามล็อกอินผิดพลาดซ้ำๆ
* ยังไม่มีระบบ Rate Limiting ที่เข้มงวดเพื่อป้องกันการโจมตีแบบ Brute-force เต็มรูปแบบ

---

## 11.6 Deployment Limitations

TODO:

ระบบปัจจุบันสามารถ Deploy ได้ที่:

* [x] Local Machine
* [x] VM
* [x] Local Network
* [ ] Cloud

ข้อจำกัด:

TODO:
การ Deploy ปัจจุบันผูกกับโครงสร้างของ Docker Compose เป็นหลัก ยังไม่ได้ปรับแพ็กเกจสำหรับการ Deploy ลงบน Kubernetes (K8s) หรือระบบ Cloud Orchestration ขนาดใหญ่

---

## 11.7 Known Issues

* กลไก Silent Refresh (ขอ Token ใหม่เบื้องหลัง) อาจทำงานผิดพลาดหากอินเทอร์เน็ตของผู้ใช้มี Latency สูงมากหรือขาดช่วงพอดี ทำให้ผู้ใช้อาจถูกเด้งกลับไปหน้าล็อกอิน
* หากผู้ใช้ไม่ได้เข้าใช้งานระบบนานเกินระยะเวลาหมดอายุของ Refresh Token (เช่น เกิน 30 วัน) ระบบจะไม่สามารถจดจำการล็อกอินได้ และผู้ใช้จำเป็นต้องล็อกอินใหม่ตามนโยบายความปลอดภัย
---

## 11.8 Out of Scope

สิ่งที่ **ไม่อยู่ในขอบเขตของ Project นี้**:

* ระบบลงทะเบียนเรียน และการจัดตารางสอน
* ระบบชำระเงินค่าธรรมเนียมการศึกษา
* ระบบขอเอกสารสำคัญทางการศึกษา เช่น การพิมพ์ทรานสคริปต์ฉบับจริง ที่มีลายเซ็นดิจิทัล
* การจัดการเปลี่ยนรหัสผ่านนักศึกษา
