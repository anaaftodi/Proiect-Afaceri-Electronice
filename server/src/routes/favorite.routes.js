const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// GET - produsele favorite ale userului curent
router.get("/", auth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

// POST - adaugă un produs la favorite
router.post("/", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // să nu adăugăm de 10 ori același produs
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    if (existing) {
      return res.json(existing);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    res.json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding favorite" });
  }
});

// DELETE - șterge un favorite după id
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.favorite.delete({
      where: { id },
    });
    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting favorite" });
  }
});

// DELETE - șterge favorite după productId (util pentru frontend)
router.delete("/product/:productId", auth, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        productId,
      },
    });
    res.json({ message: "Favorite removed for product" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting favorite by productId" });
  }
});

module.exports = router;
