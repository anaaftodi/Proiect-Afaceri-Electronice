const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");
const requireAdmin = require("../utils/adminMiddleware");

const router = express.Router();

/**
 * GET /api/users/me
 * Profilul userului curent (logat)
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { orders: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ordersCount = user.orders.length;

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
      ordersCount,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/**
 * PUT /api/users/me
 * Actualizare profil (nume + adresă)
 */
router.put("/me", auth, async (req, res) => {
  try {
    const { name, address } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        address,
      },
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

/**
 * GET /api/users
 * Doar ADMIN – listă de useri (opțional pentru panou admin)
 */
router.get("/", auth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
