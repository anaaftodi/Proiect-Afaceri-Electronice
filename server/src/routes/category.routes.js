const express = require("express");
const prisma = require("../prisma");
const auth = require("../utils/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  const { name } = req.body;

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating category" });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) return res.status(404).json({ message: "Not found" });

    res.json(category);
  } catch {
    res.status(500).json({ message: "Error fetching category" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.json(category);
  } catch {
    res.status(500).json({ message: "Error updating category" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting category" });
  }
});

module.exports = router;
