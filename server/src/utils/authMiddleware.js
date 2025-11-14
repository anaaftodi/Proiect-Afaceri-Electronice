const { verifyToken } = require("./tokenUtils");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [, token] = authHeader.split(" ");
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };

  next();
}

module.exports = auth;
