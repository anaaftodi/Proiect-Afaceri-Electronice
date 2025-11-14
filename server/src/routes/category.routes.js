const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");
const requireAdmin = require("../utils/adminMiddleware");

const router = express.Router();

/**
 * GET /api/categories
 * Public – toate categoriile
 */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories", err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

/**
 * POST /api/categories
 * Doar ADMIN – creează o categorie nouă
 */
router.post("/", auth, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // dacă name e @unique în Prisma și există deja, Prisma va arunca P2002
    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    return res.status(201).json(category);
  } catch (err) {
    console.error("Error creating category", err);

    // eroare de tip "unique constraint failed"
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Această categorie există deja." });
    }

    return res.status(500).json({ message: "Error creating category" });
  }
});

/**
 * PUT /api/categories/:id
 * Doar ADMIN – actualizează o categorie
 */
router.put("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.json(category);
  } catch (err) {
    console.error("Error updating category", err);

    if (err.code === "P2025") {
      // record not found
      return res.status(404).json({ message: "Category not found" });
    }
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Această categorie există deja." });
    }

    res.status(500).json({ message: "Error updating category" });
  }
});

/**
 * DELETE /api/categories/:id
 * Doar ADMIN – șterge o categorie
 */
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("Error deleting category", err);

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(500).json({ message: "Error deleting category" });
  }
});

module.exports = router;
