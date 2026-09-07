const express = require('express');
const jwt = require('jsonwebtoken');
const radius = require('radius');
const dgram = require('dgram');

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';
const radiusHost = process.env.RADIUS_HOST || 'localhost';
const radiusPort = Number(process.env.RADIUS_PORT || 1812);
const radiusSecret = process.env.RADIUS_SECRET || 'testing123';
const radiusTimeoutMs = Number(process.env.RADIUS_TIMEOUT_MS || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function isLocalReturnTo(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

function authenticateWithRadius(username, password) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');
    let socketClosed = false;
    const closeSocket = () => {
      if (!socketClosed) {
        socketClosed = true;
        socket.close();
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
      reject(new Error('RADIUS request timed out'));
    }, radiusTimeoutMs);

    socket.once('error', (error) => {
      clearTimeout(timer);
      closeSocket();
      reject(error);
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
        reject(error);
      }
    });
  });
}

app.get('/health', (_req, res) => {
  res.json({ service: 'central-auth', status: 'ok' });
});

app.get('/', (req, res) => {
  const returnTo = isLocalReturnTo(req.query.returnTo) ? req.query.returnTo : '/lab/';
  res.type('html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Central Login</title></head>
<body><h1>Central Authentication Service</h1>
<form method="post" action="/auth/login">
<input type="hidden" name="returnTo" value="${returnTo.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
<label>Username <input name="username" required autofocus></label><br>
<label>Password <input type="password" name="password" required></label><br>
<button type="submit">Sign in</button>
</form></body></html>`);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const accepted = await authenticateWithRadius(username, password);
    if (!accepted) {
      return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ sub: username, role: 'student' }, jwtSecret, { expiresIn: '1h' });
    const returnTo = isLocalReturnTo(req.body.returnTo) ? req.body.returnTo : '/lab/';
    const secureFlag = process.env.COOKIE_SECURE === 'true' ? '; Secure' : '';
    res.setHeader(
      'Set-Cookie',
      `sso_token=${encodeURIComponent(token)}; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax${secureFlag}`
    );
    return res.redirect(returnTo);
  } catch (error) {
    console.error('RADIUS authentication failed:', error.message);
    return res.status(503).send('Authentication service is unavailable');
  }
});

app.listen(port, () => {
  console.log(`Central Auth listening on port ${port}`);
});
