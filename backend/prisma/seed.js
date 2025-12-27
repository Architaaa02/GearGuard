const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const team = await prisma.maintenanceTeam.create({
    data: { name: "Mechanics" },
  });

  const tech = await prisma.user.create({
    data: {
      name: "John Tech",
      role: "Technician",
      maintenanceTeamId: team.id,
    },
  });

  const equipment = await prisma.equipment.create({
    data: {
      name: "Hydraulic Press",
      serialNumber: "HP-001",
      purchaseDate: new Date("2022-01-01"),
      location: "Plant A",
      department: "Production",
      maintenanceTeamId: team.id,
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      type: "Corrective",
      subject: "Oil Leak",
      equipmentId: equipment.id,
      stage: "New",
      assignedUserId: tech.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
