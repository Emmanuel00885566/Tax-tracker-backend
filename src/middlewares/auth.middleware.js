import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const h = req.headers.authorization || '';
  console.log('Auth header:', h); // debug

  if (!h.startsWith('Bearer ')) {
    console.log('❌ No Bearer token');
    return res.status(401).json({ message: 'No token' });
  }

  const token = h.split(' ')[1];
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded token:', decoded);
    req.user = { id: decoded.id || 'dev-user' };
    next();
  } catch (err) {
    console.log('❌ JWT error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}