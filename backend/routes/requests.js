const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Create maintenance request
router.post("/", async (req, res) => {
  const { type, subject, equipmentId, scheduledDate } = req.body;
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });
    if (!equipment)
      return res.status(404).json({ error: "Equipment not found" });

    const request = await prisma.maintenanceRequest.create({
      data: {
        type,
        subject,
        equipmentId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      },
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

// Update request stage/duration/assignedUser
router.put("/:id", async (req, res) => {
  const { stage, duration, assignedUserId } = req.body;
  const id = parseInt(req.params.id);

  try {
    const request = await prisma.maintenanceRequest.update({
      where: { id },
      data: { stage, duration, assignedUserId },
      include: { equipment: true },
    });

    if (stage === "Scrap") {
      await prisma.equipment.update({
        where: { id: request.equipmentId },
        data: { isScrapped: true },
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

// Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: { assignedUser: true },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Preventive requests for calendar
router.get("/calendar", async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: { type: "Preventive" },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar requests" });
  }
});

module.exports = router;
