import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import CalendarView from "./components/CalendarView";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <div className="App">
      <h1>GearGuard – Maintenance Requests</h1>
      <KanbanBoard />
      <CalendarView />
      <Dashboard />
    </div>
  );
}

export default App;
