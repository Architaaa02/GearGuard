import React from "react";
import EquipmentList from "./EquipmentList";
import KanbanBoard from "./KanbanBoard";
import CalendarView from "./CalendarView";

const Dashboard = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      padding: "16px",
    }}
  >
    <h1 style={{ textAlign: "center" }}>GearGuard – Maintenance Dashboard</h1>
    <div
      style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}
    >
      <h2>Equipment List</h2>
      <EquipmentList />
    </div>
    <div
      style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}
    >
      <h2>Maintenance Requests Kanban</h2>
      <KanbanBoard />
    </div>
    <div
      style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}
    >
      <CalendarView />
    </div>
  </div>
);

export default Dashboard;
