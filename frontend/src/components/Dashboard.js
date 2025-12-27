import React from "react";
import EquipmentList from "./EquipmentList";
import KanbanBoard from "./KanbanBoard";
import CalendarView from "./CalendarView";

const Dashboard = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "16px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>GearGuard – Maintenance Dashboard</h1>

      {/* Top Section: Equipment List */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <EquipmentList />
      </div>

      {/* Middle Section: Kanban Board */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <h2>Maintenance Requests Kanban</h2>
        <KanbanBoard />
      </div>

      {/* Bottom Section: Calendar */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <CalendarView />
      </div>
    </div>
  );
};

export default Dashboard;
