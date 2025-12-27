import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const stages = ["New", "In Progress", "Repaired", "Scrap"];

const KanbanBoard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const requestId = parseInt(draggableId);
    const newStage = destination.droppableId;

    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, {
        stage: newStage,
      });

      // Optimistically update frontend state
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, stage: newStage } : r))
      );
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };
  const isOverdue = (req) => {
    if (!req.scheduledDate) return false;
    const now = new Date();
    const scheduled = new Date(req.scheduledDate);
    return scheduled < now && req.stage !== "Repaired" && req.stage !== "Scrap";
  };

  return (
    <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {stages.map((stage) => (
          <Droppable droppableId={stage} key={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  minHeight: "300px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                <h3 style={{ textAlign: "center" }}>{stage}</h3>
                {requests
                  .filter((r) => r.stage === stage)
                  .map((req, index) => (
                    <Draggable
                      key={req.id}
                      draggableId={req.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "8px",
                            margin: "8px 0",
                            borderRadius: "4px",
                            backgroundColor: snapshot.isDragging
                              ? "#add8e6"
                              : "#fff",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{req.subject}</strong>
                          <div>Assigned: {req.assignedUser?.name || "-"}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
