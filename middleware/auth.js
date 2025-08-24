const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

  // get auth header - The Authorization header is commonly used to send authenitcation tokens
  const authHeader = req.headers['authorization'];
  
  // Extract token from "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({message: "No token provided"});
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({message: "Invalid token"});
    
    // Attach user info to request 
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;