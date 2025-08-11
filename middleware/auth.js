const jwt = require('jsonwebtoken');
const ThiSinh = require('../models/ThiSinh');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const thiSinh = await ThiSinh.findBySBD(decoded.SBD);
    
    if (!thiSinh) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.thiSinh = thiSinh;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = authMiddleware;