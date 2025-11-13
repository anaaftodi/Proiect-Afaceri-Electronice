const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  const { name, description, price, categoryId, imageUrl } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        imageUrl,
      },
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, categoryId, imageUrl } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        imageUrl,
      },
    });

    res.json(product);
  } catch {
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
