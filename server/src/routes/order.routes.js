const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// CREATE ORDER
router.post("/", auth, async (req, res) => {
  const { items } = req.body; // [{productId, quantity, price}]
  const userId = req.user.id;

  try {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
});

// GET ALL ORDERS FOR LOGGED USER
router.get("/me", auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
    });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// GET ONE ORDER
router.get("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch {
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;
