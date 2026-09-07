const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// ดึงค่า JWT_SECRET และ PORT จาก Environment
const JWT_SECRET = process.env.JWT_SECRET || 'kmitl_chumphon_sso_secret_key';
const PORT = process.env.PORT || 3002;

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
    // ดึงข้อมูล User จาก Token (เช่น req.user.sub หรือ req.user.role)
    const user = req.user;

    const data = [
        { name: "คณิตศาสตร์", score: 85, grade: "A" },
        { name: "ภาษาไทย", score: 35, grade: "F" },
        { name: "ฟิสิกส์", score: 50, grade: "D" }
    ];

    // สร้างโครงสร้าง HTML ด้วย Template Literals
    let html = `
    <!doctype html>
    <html lang="th">
    <head>
        <meta charset="utf-8">
        <title>ระบบเช็คเกรด</title>
        <style>
            table { border-collapse: collapse; width: 50%; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>ระบบเช็คเกรดนักศึกษา</h1>
        <p>เข้าสู่ระบบโดย: <strong>${user.sub || 'ไม่ระบุรหัส'}</strong></p>
        <button>ปฏิทินการศึกษา</button>
    `;

    // เช็คสิทธิ์ว่ามี Role ให้ดูเกรดได้หรือไม่
    if (user.role === 'student' || user.role === 'admin') {
        html += `<button style="background-color: blue; color: white;">ลงทะเบียนเรียน</button><br>`;
        
        // สร้างตารางเกรด
        html += `
        <table>
            <thead>
                <tr>
                    <th>วิชา</th>
                    <th>คะแนน</th>
                    <th>เกรด</th>
                </tr>
            </thead>
            <tbody>
        `;

        // วนลูปข้อมูลเพื่อสร้างแถวและเซลล์ (Body)
        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.score}</td>
                    <td>${item.grade}</td>
                </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        `;
    } else {
        html += `<p style="color:red; margin-top:20px;">คุณไม่มีสิทธิ์เข้าถึงเมนูดูเกรดและลงทะเบียนเรียน</p>`;
    }

    html += `</body></html>`;

    // 5. ส่งชุดข้อมูล HTML กลับไปให้ Browser ประมวลผล
    res.send(html);
});

// เปิด Server
app.listen(PORT, () => {
    console.log(`Web App 1 is running on port ${PORT}`);
});