const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Maintenance Teams
  const team1 = await prisma.maintenanceTeam.upsert({
    where: { name: "Mechanics" },
    update: {},
    create: { name: "Mechanics" },
  });

  const team2 = await prisma.maintenanceTeam.upsert({
    where: { name: "Electrical" },
    update: {},
    create: { name: "Electrical" },
  });

  // Users
  const user1 = await prisma.user.upsert({
    where: { name: "Alice" },
    update: {},
    create: { name: "Alice", role: "Technician", maintenanceTeamId: team1.id },
  });

  const user2 = await prisma.user.upsert({
    where: { name: "Bob" },
    update: {},
    create: { name: "Bob", role: "Manager", maintenanceTeamId: team2.id },
  });

  // Equipment
  const eq1 = await prisma.equipment.upsert({
    where: { serialNumber: "HP-001" },
    update: {},
    create: {
      name: "Hydraulic Press",
      serialNumber: "HP-001",
      purchaseDate: new Date("2022-01-15"),
      warrantyInfo: "2 years",
      location: "Workshop 1",
      department: "Production",
      assignedEmployee: "John Doe",
      maintenanceTeamId: team1.id,
    },
  });

  const eq2 = await prisma.equipment.upsert({
    where: { serialNumber: "CB-002" },
    update: {},
    create: {
      name: "Conveyor Belt",
      serialNumber: "CB-002",
      purchaseDate: new Date("2021-05-10"),
      warrantyInfo: "3 years",
      location: "Workshop 2",
      department: "Logistics",
      assignedEmployee: "Jane Smith",
      maintenanceTeamId: team2.id,
    },
  });

  // Maintenance Requests
  await prisma.maintenanceRequest.upsert({
    where: { id: 1 }, // Use a fixed ID for demo purposes
    update: {},
    create: {
      type: "Corrective",
      subject: "Oil Leak",
      equipmentId: eq1.id,
      stage: "New",
    },
  });

  await prisma.maintenanceRequest.upsert({
    where: { id: 2 },
    update: {},
    create: {
      type: "Preventive",
      subject: "Monthly Inspection",
      equipmentId: eq2.id,
      stage: "New",
      scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
  });

  await prisma.maintenanceRequest.upsert({
    where: { id: 3 },
    update: {},
    create: {
      type: "Corrective",
      subject: "Motor Replacement",
      equipmentId: eq2.id,
      stage: "In Progress",
      assignedUserId: user2.id,
    },
  });

  console.log("Seed data created (idempotent)!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
