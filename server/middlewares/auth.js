import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
