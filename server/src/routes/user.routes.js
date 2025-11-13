const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// GET all users 
router.get("/", auth, async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(users);
});

// GET user by ID
router.get("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE user
router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { name },
  });

  res.json(user);
});

// DELETE user
router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted" });
});

module.exports = router;
