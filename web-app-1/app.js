const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';

function verifyJwt(req, res, next) {
  const authorization = req.headers.authorization || '';
  const cookieToken = (req.headers.cookie || '').split(';').map((part) => part.trim())
    .find((part) => part.startsWith('sso_token='));
  const tokenFromCookie = cookieToken ? decodeURIComponent(cookieToken.slice('sso_token='.length)) : null;
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : tokenFromCookie;

  if (!token) {
    return res.redirect(`/auth/?returnTo=${encodeURIComponent(req.originalUrl)}`);
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/health', (_req, res) => {
  res.json({ service: 'web-app-1', status: 'ok' });
});

app.get('/', verifyJwt, (req, res) => {
  res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lab App</title></head>
<body><h1>Lab Reservation System</h1><p>Signed in as <strong>${req.user.sub}</strong>.</p>
<p>JWT verified by Web App 1.</p></body></html>`);
});

app.listen(port, () => {
  console.log(`Web App 1 listening on port ${port}`);
});
