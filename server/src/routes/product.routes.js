const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");
const requireAdmin = require("../utils/adminMiddleware");

const router = express.Router();

/**
 * GET /api/products
 * Public – poate fi filtrat după categoryId: /api/products?categoryId=1
 */
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;

    const where = {};
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

/**
 * GET /api/products/:id
 * Public – detalii produs
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product" });
  }
});

/**
 * POST /api/products
 * Doar ADMIN – creează produs nou
 */
router.post("/", auth, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl } = req.body;

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

/**
 * PUT /api/products/:id
 * Doar ADMIN – actualizează produs
 */
router.put("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, categoryId, imageUrl } = req.body;

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product" });
  }
});

/**
 * DELETE /api/products/:id
 * Doar ADMIN – șterge produs
 */
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
