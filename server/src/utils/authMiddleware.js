const { verifyToken } = require("./tokenUtils");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer token"

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [, token] = authHeader.split(" ");

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
