const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/equipment
router.get("/", async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: { requests: true },
    });
    res.json(equipment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

module.exports = router;
