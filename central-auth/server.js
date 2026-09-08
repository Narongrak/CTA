const express = require('express');
const jwt = require('jsonwebtoken');
const radius = require('radius');
const dgram = require('dgram');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'change-this-jwt-secret';
const radiusHost = process.env.RADIUS_HOST || 'freeradius';
const radiusPort = Number(process.env.RADIUS_PORT || 1812);
const radiusSecret = process.env.RADIUS_SECRET || 'testing123';
const radiusTimeoutMs = Number(process.env.RADIUS_TIMEOUT_MS || 5000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Refresh token store in memory (persists during container runtime)
const refreshTokens = new Map();

// Known user profile mapping (based on docs/SPEC.md Section 7.3)
const USER_PROFILES = {
  '66010001': { name: 'Somchai Jaidee', role: 'student', faculty: 'Engineering' },
  '66010002': { name: 'Maneerat Suksawat', role: 'student', faculty: 'Science' },
  '65012345678': { name: 'Anan Panyarat', role: 'student', faculty: 'Engineering' },
  'student66000001': { name: 'Demo Student', role: 'student', faculty: 'Engineering' },
  'teacher01': { name: 'Dr. Kittisak Charoenwong', role: 'teacher', faculty: 'Engineering' },
  'admin': { name: 'System Administrator', role: 'admin', faculty: 'Central IT Office' }
};

function isLocalReturnTo(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

function getUserProfile(username) {
  return USER_PROFILES[username] || {
    name: username.startsWith('6') ? `Student ${username}` : username,
    role: username.toLowerCase().includes('admin') ? 'admin' : (username.toLowerCase().includes('teacher') ? 'teacher' : 'student'),
    faculty: 'Engineering'
  };
}

function authenticateWithRadius(username, password) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');
    let socketClosed = false;
    const closeSocket = () => {
      if (!socketClosed) {
        socketClosed = true;
        try { socket.close(); } catch (_) {}
      }
    };

    const request = radius.encode({
      code: 'Access-Request',
      secret: radiusSecret,
      attributes: [
        ['User-Name', username],
        ['User-Password', password],
        ['NAS-IP-Address', '127.0.0.1']
      ]
    });

    const timer = setTimeout(() => {
      closeSocket();
      const err = new Error('RADIUS_TIMEOUT');
      err.code = 'ETIMEDOUT';
      reject(err);
    }, radiusTimeoutMs);

    socket.once('error', (error) => {
      clearTimeout(timer);
      closeSocket();
      const err = new Error('RADIUS_UNAVAILABLE');
      err.original = error;
      reject(err);
    });

    socket.once('message', (message) => {
      clearTimeout(timer);
      closeSocket();
      try {
        const response = radius.decode({ packet: message, secret: radiusSecret });
        resolve(response.code === 'Access-Accept');
      } catch (error) {
        reject(error);
      }
    });

    socket.send(request, 0, request.length, radiusPort, radiusHost, (error) => {
      if (error) {
        clearTimeout(timer);
        closeSocket();
        const err = new Error('RADIUS_UNAVAILABLE');
        err.original = error;
        reject(err);
      }
    });
  });
}

app.get('/health', (_req, res) => {
  res.json({ service: 'central-auth', status: 'ok' });
});

// Render Login Page
app.get('/', (req, res) => {
  const returnTo = isLocalReturnTo(req.query.returnTo) ? req.query.returnTo : '/';
  const errorMessage = req.query.error || '';
  const loggedOut = req.query.logged_out === '1';

  res.type('html').send(`<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เข้าสู่ระบบกลาง | Central Authentication Service (CAS)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #0b0f19;
      --card-bg: rgba(18, 24, 39, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent-blue: #3b82f6;
      --accent-cyan: #06b6d4;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --error-bg: rgba(239, 68, 68, 0.15);
      --error-border: #ef4444;
      --success-bg: rgba(16, 185, 129, 0.15);
      --success-border: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Sarabun', 'Outfit', sans-serif;
    }

    body {
      background: radial-gradient(circle at 15% 20%, #1e1b4b 0%, #0b0f19 50%, #030712 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: var(--text-main);
    }

    .login-container {
      width: 100%;
      max-width: 440px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .brand-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      color: #60a5fa;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
    }

    .banner {
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .banner.error {
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      color: #fca5a5;
    }

    .banner.success {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: #6ee7b7;
    }

    .form-group {
      margin-bottom: 18px;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 6px;
      color: #d1d5db;
    }

    .input-wrapper {
      position: relative;
    }

    input[type="text"],
    input[type="password"] {
      width: 100%;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      color: #ffffff;
      outline: none;
      transition: all 0.2s ease;
    }

    input:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .btn-submit {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      margin-top: 10px;
    }

    .btn-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
    }

    .btn-submit:active {
      transform: translateY(0);
    }

    .presets-container {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .presets-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preset-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .preset-chip:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.4);
      color: #ffffff;
    }

    .badge-role {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-student { background: #1e3a8a; color: #93c5fd; }
    .badge-teacher { background: #064e3b; color: #6ee7b7; }
    .badge-admin { background: #701a75; color: #f472b6; }

    .security-note {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="brand-header">
      <div class="brand-badge">Grade SSO Portal</div>
      <h1 class="brand-title">เข้าสู่ระบบส่วนกลาง</h1>
      <p class="brand-subtitle">Central Authentication Service with RADIUS</p>
    </div>

    ${loggedOut ? `
      <div class="banner success">
        <span>ออกจากระบบเรียบร้อยแล้ว</span>
      </div>
    ` : ''}

    ${errorMessage ? `
      <div class="banner error">
        <span>${escapeHtml(errorMessage)}</span>
      </div>
    ` : ''}

    <form id="loginForm" method="post" action="/auth/login" onsubmit="return validateForm()">
      <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}">
      
      <div class="form-group">
        <label for="username">รหัสผู้ใช้งาน / รหัสนักศึกษา (Username)</label>
        <div class="input-wrapper">
          <input type="text" id="username" name="username" placeholder="เช่น 66010001, teacher01, admin" autofocus>
        </div>
      </div>

      <div class="form-group">
        <label for="password">รหัสผ่าน (Password)</label>
        <div class="input-wrapper">
          <input type="password" id="password" name="password" placeholder="กรอกรหัสผ่านของคุณ">
        </div>
      </div>

      <button type="submit" class="btn-submit" id="submitBtn">เข้าสู่ระบบ</button>
    </form>

    <div class="presets-container">
      <div class="presets-title">
        <span>บัญชีทดสอบ (Quick Fill)</span>
        <span style="font-size:10px; color:#6b7280;">คลิกเพื่อกรอกอัตโนมัติ</span>
      </div>
      <div class="preset-chips">
        <button type="button" class="preset-chip" onclick="fillCreds('66010001', 'password123')">
          <span>66010001</span>
          <span class="badge-role badge-student">Student</span>
        </button>
        <button type="button" class="preset-chip" onclick="fillCreds('66010002', 'password123')">
          <span>66010002</span>
          <span class="badge-role badge-student">Student</span>
        </button>
        <button type="button" class="preset-chip" onclick="fillCreds('teacher01', 'teacher123')">
          <span>teacher01</span>
          <span class="badge-role badge-teacher">Teacher</span>
        </button>
        <button type="button" class="preset-chip" onclick="fillCreds('admin', 'admin1234')">
          <span>admin</span>
          <span class="badge-role badge-admin">Admin</span>
        </button>
      </div>
    </div>

    <div class="security-note">
      ความปลอดภัยระดับสถาบัน: ตรวจสอบสิทธิ์ผ่าน FreeRADIUS PAP & JWT
    </div>
  </div>

  <script>
    function fillCreds(u, p) {
      document.getElementById('username').value = u;
      document.getElementById('password').value = p;
    }

    function validateForm() {
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value;
      if (!u || !p) {
        alert('กรุณากรอกรหัสผู้ใช้งานและรหัสผ่าน');
        return false;
      }
      return true;
    }
  </script>
</body>
</html>`);
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// POST /login - RADIUS Authentication & Token Generation
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const returnTo = isLocalReturnTo(req.body.returnTo) ? req.body.returnTo : '/';

  // TC-AUTH-04: Empty username or password
  if (!username || !password || !username.trim()) {
    return res.redirect(`/auth/?error=${encodeURIComponent('กรุณากรอกรหัสผู้ใช้งานและรหัสผ่าน')}&returnTo=${encodeURIComponent(returnTo)}`);
  }

  const cleanUser = username.trim();

  try {
    const accepted = await authenticateWithRadius(cleanUser, password);

    // TC-AUTH-02 / TC-AUTH-03: Invalid credentials
    if (!accepted) {
      return res.redirect(`/auth/?error=${encodeURIComponent('รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')}&returnTo=${encodeURIComponent(returnTo)}`);
    }

    // Success: Look up user profile & issue tokens
    const profile = getUserProfile(cleanUser);

    // Access Token (short-lived: 1 hour)
    const accessToken = jwt.sign(
      {
        iss: 'central-auth-service',
        sub: cleanUser,
        name: profile.name,
        role: profile.role,
        faculty: profile.faculty
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Refresh Token (long-lived: 30 days) for "Remember Me" / Silent Refresh
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    refreshTokens.set(refreshToken, {
      username: cleanUser,
      role: profile.role,
      expiresAt: refreshExpiresAt
    });

    const secureFlag = process.env.COOKIE_SECURE === 'true' ? '; Secure' : '';

    // Set Access Token cookie (accessible system-wide)
    res.setHeader('Set-Cookie', [
      `sso_token=${encodeURIComponent(accessToken)}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax${secureFlag}`,
      `sso_refresh_token=${encodeURIComponent(refreshToken)}; Max-Age=2592000; Path=/auth/; HttpOnly; SameSite=Lax${secureFlag}`
    ]);

    return res.redirect(returnTo);

  } catch (error) {
    console.error('RADIUS authentication error:', error.message);

    // TC-RADIUS-03: RADIUS Timeout
    if (error.message === 'RADIUS_TIMEOUT' || error.code === 'ETIMEDOUT') {
      return res.redirect(`/auth/?error=${encodeURIComponent('ระบบใช้เวลาตอบกลับนานเกินไป กรุณาลองใหม่อีกครั้ง')}&returnTo=${encodeURIComponent(returnTo)}`);
    }

    // TC-RADIUS-02: RADIUS Unavailable / Server Down
    return res.redirect(`/auth/?error=${encodeURIComponent('ระบบตรวจสอบสิทธิ์ของมหาวิทยาลัยขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง')}&returnTo=${encodeURIComponent(returnTo)}`);
  }
});

// GET /refresh - Silent Refresh endpoint
app.get('/refresh', (req, res) => {
  const refreshToken = req.cookies.sso_refresh_token;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  const session = refreshTokens.get(refreshToken);
  if (new Date() > session.expiresAt) {
    refreshTokens.delete(refreshToken);
    return res.status(401).json({ error: 'Refresh token expired' });
  }

  const profile = getUserProfile(session.username);

  // Issue new Access Token
  const newAccessToken = jwt.sign(
    {
      iss: 'central-auth-service',
      sub: session.username,
      name: profile.name,
      role: profile.role,
      faculty: profile.faculty
    },
    jwtSecret,
    { expiresIn: '1h' }
  );

  const secureFlag = process.env.COOKIE_SECURE === 'true' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `sso_token=${encodeURIComponent(newAccessToken)}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax${secureFlag}`
  );

  return res.json({
    success: true,
    token: newAccessToken,
    user: {
      sub: session.username,
      name: profile.name,
      role: profile.role
    }
  });
});

// GET /logout - Clears cookies and revokes session
app.get('/logout', (req, res) => {
  const refreshToken = req.cookies.sso_refresh_token;
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken);
  }

  res.setHeader('Set-Cookie', [
    'sso_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    'sso_refresh_token=; Max-Age=0; Path=/auth/; HttpOnly; SameSite=Lax'
  ]);

  return res.redirect('/auth/?logged_out=1');
});

// POST /logout - For programmatic / Axios logout
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.sso_refresh_token;
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken);
  }

  res.setHeader('Set-Cookie', [
    'sso_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    'sso_refresh_token=; Max-Age=0; Path=/auth/; HttpOnly; SameSite=Lax'
  ]);

  return res.json({ success: true, message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Central Auth Service running on port ${port}`);
});
