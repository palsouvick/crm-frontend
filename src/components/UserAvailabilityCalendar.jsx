import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "../api/axios";

const UserAvailabilityCalendar = ({ assignedTo }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!assignedTo) {
      setEvents([]);
      return;
    }

    // loadAvailability();
    
  }, [assignedTo]);

//   const loadAvailability = async () => {
//     const res = await axios.get(
//       `/follow-ups/availability?assignedTo=${assignedTo}`
//     );
//     setEvents(res.data);
//   };

  if (!assignedTo) {
    return (
      <p className="text-sm text-gray-500">
        Select a user to view availability
      </p>
    );
  }

  return (
    <>
      <h3 className="font-semibold mb-2 text-gray-700">
        User Availability
      </h3>

      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        height={500}
        events={events}
        slotMinTime="09:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
      />
    </>
  );
};

export default UserAvailabilityCalendar;
