const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// GET - toate produsele din coșul userului curent
router.get("/", auth, async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

// POST - adaugă produs în coș (sau crește cantitatea)
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId: Number(productId),
          quantity: Number(quantity),
        },
      });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// PUT - modifică cantitatea unui item din coș
router.put("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity: Number(quantity) },
    });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating cart item" });
  }
});

// DELETE - șterge un item din coș
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.cartItem.delete({
      where: { id },
    });
    res.json({ message: "Cart item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting cart item" });
  }
});

// DELETE - golește întreg coșul userului
router.delete("/", auth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
