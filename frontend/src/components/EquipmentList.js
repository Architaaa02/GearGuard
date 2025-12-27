import React, { useEffect, useState } from "react";
import axios from "axios";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment");
      setEquipment(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Show maintenance requests for a specific equipment
  const showRequests = (equipmentId) => {
    const eq = equipment.find((e) => e.id === equipmentId);
    if (!eq) return;
    const openRequests = eq.requests || [];
    if (openRequests.length === 0) {
      alert("No maintenance requests for this equipment.");
      return;
    }
    const formatted = openRequests
      .map(
        (r) =>
          `• [${r.stage}] ${r.subject} - Assigned: ${
            r.assignedUser?.name || "Unassigned"
          }`
      )
      .join("\n");
    alert(`Maintenance Requests for ${eq.name}:\n\n${formatted}`);
  };

  return (
    <div>
      <h2>Equipment List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Assigned Employee</th>
            <th>Status</th>
            <th>Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq) => (
            <tr key={eq.id}>
              <td>{eq.name}</td>
              <td>{eq.department}</td>
              <td>{eq.assignedEmployee || "-"}</td>
              <td>{eq.isScrapped ? "Scrapped" : "Active"}</td>
              <td>
                <button onClick={() => showRequests(eq.id)}>
                  Maintenance{" "}
                  {eq.requests?.length ? `(${eq.requests.length})` : ""}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;
