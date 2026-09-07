const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// ดึงค่า JWT_SECRET และ PORT จาก Environment
const JWT_SECRET = process.env.JWT_SECRET || 'kmitl_chumphon_sso_secret_key';
const PORT = process.env.PORT || 4000;


// Middleware: ตรวจสอบ JWT Token
const verifyToken = (req, res, next) => {

    // 1. ดึง Token จาก Cookie
    const token = req.cookies.sso_token;

    // 2. ถ้าไม่มี Token ให้ไปหน้า Login
    if (!token) {
        return res.redirect('/auth');
    }

    try {
        // 3. ตรวจสอบ Token และ Signature
        const decoded = jwt.verify(token, JWT_SECRET);

        // เก็บข้อมูล User
        req.user = decoded;

        // อนุญาตให้ไปต่อ
        next();

    } catch (error) {

        // Token ปลอมหรือหมดอายุ
        return res.redirect('/auth');
    }
};


// Route หน้าแรก
app.get('/', verifyToken, (req, res) => {

    // ดึงข้อมูล User จาก Token
    const user = req.user;

    // สร้างหน้า HTML
    let html = `
        <h1>ยินดีต้อนรับรหัส: ${user.student_id || 'ไม่ระบุ'}</h1>
    `;

    // ทุกคนสามารถเห็นปฏิทิน
    html += `
        <button>ปฏิทินการศึกษา</button>
        <br><br>
    `;

    // Authorization ตรวจสอบ Role
    if (user.role === 'student' || user.role === 'admin') {

        html += `
            <button style="background-color: green; color: white;">
                ดูเกรด
            </button>

            <button style="background-color: blue; color: white;">
                ลงทะเบียนเรียน
            </button>
        `;

    } else {

        html += `
            <p style="color:red;">
                คุณไม่มีสิทธิ์เข้าถึงเมนูดูเกรดและลงทะเบียนเรียน
            </p>
        `;
    }

    res.send(html);
});


// เปิด Server
app.listen(PORT, () => {
    console.log(`Web App 1 is running on port ${PORT}`);
});