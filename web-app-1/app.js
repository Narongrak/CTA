const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'change-this-jwt-secret';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Database connection pool
const dbConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'postgres',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'gradedb'
    };

const pool = new Pool(dbConfig);
let dbConnected = false;

pool.connect((err, client, release) => {
  if (err) {
    console.warn('Database connection warning (running with resilient fallback):', err.message);
  } else {
    dbConnected = true;
    release();
    console.log('Successfully connected to PostgreSQL database');
  }
});

// Resilient In-Memory Fallback Mock Data (ensures smooth experience even if DB container is spinning up)
const mockData = {
  students: {
    '66010001': { id: 1, student_id: '66010001', name: 'Somchai Jaidee', email: 'somchai.j@university.ac.th', major: 'Computer Engineering', faculty: 'Engineering' },
    '66010002': { id: 2, student_id: '66010002', name: 'Maneerat Suksawat', email: 'maneerat.s@university.ac.th', major: 'Information Technology', faculty: 'Science' },
    '65012345678': { id: 3, student_id: '65012345678', name: 'Anan Panyarat', email: 'anan.p@university.ac.th', major: 'Software Engineering', faculty: 'Engineering' }
  },
  subjects: [
    { id: 1, code: 'CPE101', name: 'Computer Programming', credits: 3, instructor: 'Dr. Kittisak Charoenwong' },
    { id: 2, code: 'CPE102', name: 'Object-Oriented Programming', credits: 3, instructor: 'Dr. Kittisak Charoenwong' },
    { id: 3, code: 'CPE201', name: 'Data Structures & Algorithms', credits: 3, instructor: 'Dr. Kittisak Charoenwong' },
    { id: 4, code: 'CPE301', name: 'Computer Networks', credits: 3, instructor: 'Asst. Prof. Viroj Tang' },
    { id: 5, code: 'CPE302', name: 'Database Systems', credits: 3, instructor: 'Dr. Kittisak Charoenwong' },
    { id: 6, code: 'GEN101', name: 'English for Academic Purposes', credits: 3, instructor: 'Aj. Sarah Jenkins' },
    { id: 7, code: 'MTH101', name: 'Calculus I', credits: 3, instructor: 'Assoc. Prof. Prasert Som' }
  ],
  grades: [
    { id: 1, student_id: '66010001', subject_id: 1, semester: '1/2566', grade: 'A' },
    { id: 2, student_id: '66010001', subject_id: 6, semester: '1/2566', grade: 'B+' },
    { id: 3, student_id: '66010001', subject_id: 7, semester: '1/2566', grade: 'B' },
    { id: 4, student_id: '66010001', subject_id: 2, semester: '2/2566', grade: 'A' },
    { id: 5, student_id: '66010001', subject_id: 3, semester: '2/2566', grade: 'A' },
    { id: 6, student_id: '66010001', subject_id: 4, semester: '1/2567', grade: 'B+' },
    { id: 7, student_id: '66010001', subject_id: 5, semester: '1/2567', grade: 'A' },
    { id: 8, student_id: '66010002', subject_id: 1, semester: '1/2566', grade: 'B+' },
    { id: 9, student_id: '66010002', subject_id: 6, semester: '1/2566', grade: 'A' },
    { id: 10, student_id: '66010002', subject_id: 7, semester: '1/2566', grade: 'C+' },
    { id: 11, student_id: '66010002', subject_id: 2, semester: '2/2566', grade: 'B' },
    { id: 12, student_id: '66010002', subject_id: 3, semester: '2/2566', grade: 'B+' },
    { id: 13, student_id: '66010002', subject_id: 5, semester: '1/2567', grade: 'B' },
    { id: 14, student_id: '65012345678', subject_id: 1, semester: '1/2565', grade: 'A' },
    { id: 15, student_id: '65012345678', subject_id: 2, semester: '2/2565', grade: 'B+' },
    { id: 16, student_id: '65012345678', subject_id: 3, semester: '1/2566', grade: 'A' },
    { id: 17, student_id: '65012345678', subject_id: 4, semester: '2/2566', grade: 'A' },
    { id: 18, student_id: '65012345678', subject_id: 5, semester: '1/2567', grade: 'A' }
  ],
  calendar: [
    { id: 1, title: 'ลงทะเบียนเรียน ภาคการศึกษาที่ 1/2567', description: 'กำหนดการลงทะเบียนเรียนผ่านระบบออนไลน์สำหรับนักศึกษาทุกชั้นปี', start_date: '2026-06-01', end_date: '2026-06-15', category: 'Registration' },
    { id: 2, title: 'วันเปิดภาคการศึกษา 1/2567', description: 'วันแรกของการเรียนการสอนในภาคการศึกษาปกติ', start_date: '2026-06-22', end_date: '2026-06-22', category: 'Academic' },
    { id: 3, title: 'วันสุดท้ายของการเพิ่ม-ถอนรายวิชา', description: 'ยื่นคำร้องขอเพิ่มหรือถอนรายวิชาโดยไม่ได้รับอักษร W', start_date: '2026-07-06', end_date: '2026-07-06', category: 'Registration' },
    { id: 4, title: 'สัปดาห์สอบกลางภาค (Midterm Exam)', description: 'การสอบวัดผลกลางภาคการศึกษาที่ 1/2567', start_date: '2026-08-10', end_date: '2026-08-16', category: 'Exam' },
    { id: 5, title: 'กำหนดส่งระดับคะแนน (เกรด) สำหรับอาจารย์', description: 'อาจารย์ประจำวิชาบันทึกเกรดเข้าสู่ระบบสารสนเทศ', start_date: '2026-10-15', end_date: '2026-10-22', category: 'Grade' },
    { id: 6, title: 'สัปดาห์สอบไล่ปลายภาค (Final Exam)', description: 'การสอบวัดผลปลายภาคการศึกษาที่ 1/2567', start_date: '2026-10-01', end_date: '2026-10-14', category: 'Exam' },
    { id: 7, title: 'วันประกาศผลการเรียนอย่างเป็นทางการ', description: 'นักศึกษาสามารถตรวจสอบผลการเรียนภาคการศึกษา 1/2567 ผ่านเว็บพอร์ทัล', start_date: '2026-10-25', end_date: '2026-10-25', category: 'Grade' }
  ],
  audit_logs: [
    { id: 1, username: 'system', action: 'System database initialized with mock academic schema', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, username: 'admin', action: 'Configured semester 1/2567 academic calendar events', created_at: new Date(Date.now() - 43200000).toISOString() }
  ]
};

const GRADE_POINTS = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

// Authentication Middleware (docs/SPEC.md Section 3 & TC-JWT-01/02)
function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const cookieToken = req.cookies.sso_token;
  
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieToken) {
    token = decodeURIComponent(cookieToken);
  }

  if (!token) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Unauthorized: Missing access token' });
    }
    const originalUrl = req.originalUrl || '/';
    return res.redirect(`/auth/?returnTo=${encodeURIComponent(originalUrl)}`);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    return res.redirect(`/auth/?returnTo=${encodeURIComponent(req.originalUrl || '/')}`);
  }
}

// Role-Based Access Control Middleware (docs/SPEC.md Section 6.2 & TC-ROLE-04)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Insufficient permissions)' });
    }
    next();
  };
}

// Helper: calculate GPA and summary
function calculateGpaSummary(gradeRecords) {
  let totalGradePoints = 0;
  let totalCredits = 0;
  const semesterMap = {};

  gradeRecords.forEach(item => {
    const point = GRADE_POINTS[item.grade] !== undefined ? GRADE_POINTS[item.grade] : 0.0;
    const credits = Number(item.credits) || 3;
    totalGradePoints += point * credits;
    totalCredits += credits;

    if (!semesterMap[item.semester]) {
      semesterMap[item.semester] = {
        semester: item.semester,
        credits: 0,
        gradePoints: 0,
        courses: []
      };
    }
    semesterMap[item.semester].credits += credits;
    semesterMap[item.semester].gradePoints += point * credits;
    semesterMap[item.semester].courses.push({
      ...item,
      point
    });
  });

  const cumulativeGpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';

  const semesters = Object.values(semesterMap).map(sem => ({
    semester: sem.semester,
    credits: sem.credits,
    semesterGpa: sem.credits > 0 ? (sem.gradePoints / sem.credits).toFixed(2) : '0.00',
    courses: sem.courses
  }));

  return {
    cumulativeGpa,
    totalCredits,
    semesters
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// GET /api/me - Current user profile
app.get('/api/me', verifyJwt, async (req, res) => {
  const username = req.user.sub;
  let profile = {
    username,
    name: req.user.name || username,
    role: req.user.role,
    faculty: req.user.faculty || 'Engineering'
  };

  try {
    if (dbConnected) {
      const dbRes = await pool.query('SELECT * FROM students WHERE student_id = $1', [username]);
      if (dbRes.rows.length > 0) {
        profile = { ...profile, ...dbRes.rows[0] };
      }
    } else if (mockData.students[username]) {
      profile = { ...profile, ...mockData.students[username] };
    }
  } catch (err) {
    console.error('Error fetching student profile:', err.message);
  }

  res.json({
    user: profile
  });
});

// GET /api/grades - Role-filtered grades (docs/SPEC.md TC-ROLE-01 / 02)
app.get('/api/grades', verifyJwt, async (req, res) => {
  const role = req.user.role;
  const username = req.user.sub;

  try {
    if (role === 'student') {
      // Student can ONLY view own grades (docs/SPEC.md TC-ROLE-01 & BRIEF Goal)
      let records = [];
      if (dbConnected) {
        const query = `
          SELECT g.id, s.code, s.name as subject_name, s.credits, g.semester, g.grade
          FROM grades g
          JOIN students st ON g.student_id = st.id
          JOIN subjects s ON g.subject_id = s.id
          WHERE st.student_id = $1
          ORDER BY g.semester ASC, s.code ASC;
        `;
        const dbRes = await pool.query(query, [username]);
        records = dbRes.rows;
      } else {
        const studentGrades = mockData.grades.filter(g => g.student_id === username);
        records = studentGrades.map(g => {
          const sub = mockData.subjects.find(s => s.id === g.subject_id) || { code: 'N/A', name: 'Unknown', credits: 3 };
          return {
            id: g.id,
            code: sub.code,
            subject_name: sub.name,
            credits: sub.credits,
            semester: g.semester,
            grade: g.grade
          };
        });
      }

      const summary = calculateGpaSummary(records);
      return res.json({
        role: 'student',
        studentId: username,
        ...summary
      });
    }

    if (role === 'teacher') {
      // Teacher can view and manage grades (docs/SPEC.md TC-ROLE-02)
      let records = [];
      if (dbConnected) {
        const query = `
          SELECT g.id, st.student_id, st.name as student_name, s.id as subject_id, s.code, s.name as subject_name, s.credits, g.semester, g.grade
          FROM grades g
          JOIN students st ON g.student_id = st.id
          JOIN subjects s ON g.subject_id = s.id
          ORDER BY s.code, st.student_id;
        `;
        const dbRes = await pool.query(query);
        records = dbRes.rows;
      } else {
        records = mockData.grades.map(g => {
          const student = mockData.students[g.student_id] || { student_id: g.student_id, name: 'Student' };
          const sub = mockData.subjects.find(s => s.id === g.subject_id) || { id: g.subject_id, code: 'N/A', name: 'Unknown', credits: 3 };
          return {
            id: g.id,
            student_id: g.student_id,
            student_name: student.name,
            subject_id: sub.id,
            code: sub.code,
            subject_name: sub.name,
            credits: sub.credits,
            semester: g.semester,
            grade: g.grade
          };
        });
      }

      return res.json({
        role: 'teacher',
        grades: records,
        subjects: mockData.subjects
      });
    }

    if (role === 'admin') {
      // Admin system summary
      let records = [];
      if (dbConnected) {
        const query = `
          SELECT g.id, st.student_id, st.name as student_name, s.code, s.name as subject_name, g.semester, g.grade
          FROM grades g
          JOIN students st ON g.student_id = st.id
          JOIN subjects s ON g.subject_id = s.id
          LIMIT 50;
        `;
        const dbRes = await pool.query(query);
        records = dbRes.rows;
      } else {
        records = mockData.grades.slice(0, 20);
      }
      return res.json({
        role: 'admin',
        recentGrades: records
      });
    }

    return res.status(403).json({ error: 'Role not recognized' });
  } catch (err) {
    console.error('Grades API error:', err);
    res.status(500).json({ error: 'Failed to fetch grades data' });
  }
});

// POST /api/grades/update - Teacher updates grade (docs/SPEC.md TC-ROLE-02 & TC-DB-04)
app.post('/api/grades/update', verifyJwt, requireRole('teacher', 'admin'), async (req, res) => {
  const { id, grade } = req.body;
  const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

  // TC-DB-04: Invalid grade letters rejected with 400 Bad Request
  if (!grade || !validGrades.includes(grade.toUpperCase())) {
    return res.status(400).json({ error: 'เกรดต้องเป็นหนึ่งใน: A, B+, B, C+, C, D+, D, F เท่านั้น (Invalid Grade)' });
  }

  const cleanGrade = grade.toUpperCase();

  try {
    const logAction = `${req.user.sub} (${req.user.role}) updated grade for record ID ${id} to ${cleanGrade}`;
    
    if (dbConnected) {
      await pool.query('UPDATE grades SET grade = $1 WHERE id = $2', [cleanGrade, id]);
      await pool.query('INSERT INTO audit_logs (username, action) VALUES ($1, $2)', [req.user.sub, logAction]);
    } else {
      const record = mockData.grades.find(g => g.id === Number(id));
      if (record) {
        record.grade = cleanGrade;
      }
      mockData.audit_logs.unshift({
        id: mockData.audit_logs.length + 1,
        username: req.user.sub,
        action: logAction,
        created_at: new Date().toISOString()
      });
    }

    return res.json({ success: true, message: 'บันทึกเกรดเรียบร้อยแล้ว', grade: cleanGrade });
  } catch (err) {
    console.error('Update grade error:', err);
    return res.status(500).json({ error: 'Could not update grade in database' });
  }
});

// GET /api/calendar - Academic Calendar (all authenticated users)
app.get('/api/calendar', verifyJwt, async (_req, res) => {
  try {
    let events = [];
    if (dbConnected) {
      const dbRes = await pool.query('SELECT * FROM academic_calendar ORDER BY start_date ASC');
      events = dbRes.rows;
    } else {
      events = mockData.calendar;
    }
    res.json({ events });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ error: 'Failed to load calendar' });
  }
});

// POST /api/calendar - Admin adds event (docs/SPEC.md TC-ROLE-03 & TC-DB-02)
app.post('/api/calendar', verifyJwt, requireRole('admin'), async (req, res) => {
  const { title, description, start_date, end_date, category } = req.body;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'Title, start date, and end date are required' });
  }

  try {
    const logAction = `${req.user.sub} created academic calendar event: "${title}"`;
    let newId = Date.now();

    if (dbConnected) {
      const insertRes = await pool.query(
        'INSERT INTO academic_calendar (title, description, start_date, end_date, category) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [title, description || '', start_date, end_date, category || 'General']
      );
      newId = insertRes.rows[0].id;
      await pool.query('INSERT INTO audit_logs (username, action) VALUES ($1, $2)', [req.user.sub, logAction]);
    } else {
      mockData.calendar.push({
        id: newId,
        title,
        description: description || '',
        start_date,
        end_date,
        category: category || 'General'
      });
      mockData.audit_logs.unshift({
        id: mockData.audit_logs.length + 1,
        username: req.user.sub,
        action: logAction,
        created_at: new Date().toISOString()
      });
    }

    res.json({ success: true, message: 'เพิ่มกิจกรรมปฏิทินการศึกษาเรียบร้อย', eventId: newId });
  } catch (err) {
    console.error('Add event error:', err);
    res.status(500).json({ error: 'Failed to add calendar event' });
  }
});

// DELETE /api/calendar/:id - Admin deletes event
app.delete('/api/calendar/:id', verifyJwt, requireRole('admin'), async (req, res) => {
  const eventId = Number(req.params.id);

  try {
    const logAction = `${req.user.sub} deleted calendar event ID ${eventId}`;

    if (dbConnected) {
      await pool.query('DELETE FROM academic_calendar WHERE id = $1', [eventId]);
      await pool.query('INSERT INTO audit_logs (username, action) VALUES ($1, $2)', [req.user.sub, logAction]);
    } else {
      mockData.calendar = mockData.calendar.filter(e => e.id !== eventId);
      mockData.audit_logs.unshift({
        id: mockData.audit_logs.length + 1,
        username: req.user.sub,
        action: logAction,
        created_at: new Date().toISOString()
      });
    }

    res.json({ success: true, message: 'ลบกิจกรรมสำเร็จ' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// GET /api/admin/audit-logs - Admin views audit logs
app.get('/api/admin/audit-logs', verifyJwt, requireRole('admin'), async (_req, res) => {
  try {
    let logs = [];
    if (dbConnected) {
      const dbRes = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
      logs = dbRes.rows;
    } else {
      logs = mockData.audit_logs;
    }
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Health endpoint
app.get('/health', (_req, res) => {
  res.json({ service: 'grade-web-app', status: 'ok', database: dbConnected ? 'connected' : 'fallback' });
});

// Serve frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA navigation - Enforce Authentication
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return verifyJwt(req, res, () => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Grade Web Application listening on port ${port}`);
});
