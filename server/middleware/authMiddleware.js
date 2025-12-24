const { verifyToken } = require('../utils/jwtUtils');
const db = require('../config/database');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || ! authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login.'
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists in database
    const [users] = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?  AND is_active = TRUE',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Please login again.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Attach user to request
    req.user = {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error. message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please login again.'
    });
  }
};

module.exports = { protect };