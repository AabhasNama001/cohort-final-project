const jwt = require("jsonwebtoken");

function createAuthMiddleware(roles = ["user"]) {
  return function authMiddleware(req, res, next) {
    let token = null
    if (req.cookies && req.cookies.token) token = req.cookies.token
    else if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2) token = parts[1]
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permissions",
        });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }
  };
}

module.exports = createAuthMiddleware;
