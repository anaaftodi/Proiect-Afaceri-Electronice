const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,   // 🔥 aici
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
