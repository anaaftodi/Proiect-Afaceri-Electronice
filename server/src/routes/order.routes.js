const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

/**
 * POST /api/orders
 * Creează o comandă din coșul utilizatorului logat
 * Body: { address, paymentMethod }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    // 1. Luăm itemele din coș pentru userul curent
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Coșul este gol" });
    }

    // 2. Calculăm totalul
    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // 3. Creăm comanda + OrderItems
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        address: address || null,
        paymentMethod: paymentMethod || null,
        total,
        status: "PLACED",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 4. Golește coșul după plasarea comenzii
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order", err);
    return res.status(500).json({ message: "Error creating order" });
  }
});

/**
 * GET /api/orders
 * Comenzile userului logat
 */
router.get("/", auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
