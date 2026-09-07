const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// ดึงค่า JWT_SECRET และ PORT มาจาก environment (อ้างอิงตาม docker-compose.yml)
const JWT_SECRET = process.env.JWT_SECRET || 'kmitl_chumphon_sso_secret_key'; //
const PORT = process.env.PORT || 3001; //[cite: 1]

// Middleware: ฟังก์ชันสำหรับแกะ JWT ออกมาตรวจสอบ
const verifyToken = (req, res, next) => {
    // 1. ดึง Token จาก Cookie (สมมติว่า Central Auth ตั้งชื่อ cookie ว่า 'sso_token')
    const token = req.cookies.sso_token; 

    // 2. ตรวจสอบว่ามี Token หรือไม่ 
    if (!token) {
        // หากไม่มี ระบบจะ Redirect กลับไปหน้า Login กลาง[cite: 1]
        return res.redirect('/auth');
    }

    try {
        // 3. ตรวจสอบความถูกต้องของ Signature (ลายเซ็นดิจิทัล)[cite: 1]
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // เก็บข้อมูลผู้ใช้ (เช่น รหัสนักศึกษา, Role) ไว้ใช้งานต่อ
        next(); // ผ่านการตรวจสอบ ให้ทำคำสั่งถัดไปได้
    } catch (error) {
        // ถ้ายืนยัน Signature ไม่สำเร็จ (Token ปลอม หรือ หมดอายุ) ให้ Redirect ไป Login ใหม่
        return res.redirect('/auth');
    }
};

// Route: หน้าแรกของระบบ 1 
app.get('/', verifyToken, (req, res) => {
    // ข้อมูล user ตอนนี้จะถูกถอดรหัสออกมาแล้ว เช่น { student_id: '66xxxxxx', role: 'student' }
    const user = req.user; 

    // --- ส่วนของการวาดหน้าจอ (UI) ---
    let html = `<h1>ยินดีต้อนรับรหัส: ${user.student_id || 'ไม่ระบุ'}</h1>`;
    
    // ปุ่มที่ทุกคนเห็นได้
    html += `<button>ปฏิทินการศึกษา</button><br><br>`;

    // การให้สิทธิ์ (Authorization): เช็คว่าคนนี้มีสิทธิ์ดูเกรดหรือไม่จาก Role[cite: 1]
    if (user.role === 'student' || user.role === 'admin') {
        // ถ้าเป็น student หรือ admin จะเห็น 2 ปุ่มนี้
        html += `<button style="background-color: green; color: white;">ดูเกรด</button> `;
        html += `<button style="background-color: blue; color: white;">ลงทะเบียนเรียน</button> `;
    } else {
        // ถ้าไม่ใช่ (เช่น เป็น Guest) 
        html += `<p style="color:red;">คุณไม่มีสิทธิ์เข้าถึงเมนูดูเกรดและลงทะเบียนเรียน</p>`;
    }

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Web App 1 is running on port ${PORT}`);
});