import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
  // Try both a custom `token:` header and a standard `Authorization: Bearer ...`
  const rawToken =
    req.headers.token ||
    (req.headers.authorization || '').split(' ')[1];

  if (!rawToken) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorized. Please log in again.',
    });
  }

  try {
    // Verify with your JWT secret; make sure process.env.JWT_SECRET is set
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw new Error('Invalid token payload');
    }
    // Attach userId for downstream controllers
    req.body.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export default authUser;
