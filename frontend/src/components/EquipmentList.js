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

  const showRequests = (id) => {
    const related = equipment.find((eq) => eq.id === id)?.requests || [];
    alert(
      related.length
        ? related.map((r) => `${r.subject} (${r.stage})`).join("\n")
        : "No requests"
    );
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Serial</th>
          <th>Dept</th>
          <th>Employee</th>
          <th>Maintenance</th>
        </tr>
      </thead>
      <tbody>
        {equipment.map((eq) => (
          <tr key={eq.id} style={{ borderBottom: "1px solid #ccc" }}>
            <td>{eq.name}</td>
            <td>{eq.serialNumber}</td>
            <td>{eq.department}</td>
            <td>{eq.assignedEmployee || "-"}</td>
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
  );
};

export default EquipmentList;
