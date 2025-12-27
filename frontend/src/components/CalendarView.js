import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const CalendarView = () => {
  const [requests, setRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/calendar"
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Logic to open modal/form for new preventive request
    alert(`Create preventive request for ${date.toDateString()}`);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayRequests = requests.filter(
        (r) => new Date(r.scheduledDate).toDateString() === date.toDateString()
      );
      return dayRequests.length ? (
        <span style={{ color: "red" }}>●</span>
      ) : null;
    }
  };

  return (
    <div>
      <h2>Preventive Maintenance Calendar</h2>
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileContent={tileContent}
      />
    </div>
  );
};

export default CalendarView;
