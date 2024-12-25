import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import "@/styles/calendar.css";
import { Reservation, CalendarEvent } from "../screen/modals/types";

type Props = {
  reservations: Reservation[];
  zoomIndex: number;
  onZoomChange: (index: number) => void;
  onSlotSelect: (calendarEvent: CalendarEvent) => void;
  onEventClick: (reservation: Reservation) => void;
};

const zoomLevels = [
  { label: "Week", name: "timeGridWeek", slotDuration: "01:00:00" },
  { label: "Day", name: "timeGridDay", slotDuration: "00:30:00" },
  { label: "Hour", name: "timeGridDay", slotDuration: "00:15:00" },
  { label: "Minute", name: "timeGridDay", slotDuration: "00:05:00" },
];

const FullCalendarWrapper = ({
  reservations,
  zoomIndex,
  onZoomChange,
  onSlotSelect,
  onEventClick,
}: Props) => {
  const currentZoom = zoomLevels[zoomIndex];
  const calendarRef = useRef<FullCalendar>(null);

  const [currentFormattedDate, setCurrentFormattedDate] = useState<string>()

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    setCurrentFormattedDate(formatDate(calendarRef.current?.getApi().getDate()));
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
    setCurrentFormattedDate(formatDate(calendarRef.current?.getApi().getDate()));
  };


  const formatDate = (currentDate: Date) => {
    return `${currentDate.toLocaleDateString("en-US", {
      weekday: "short",
    })}, ${currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  useEffect(() => {
    if (calendarRef.current) {
      setTimeout(() => calendarRef.current.requestResize(), 100)
      const currentDate = calendarRef.current?.getApi().getDate() || new Date();    
      setCurrentFormattedDate(formatDate(currentDate));
    }
  }, [calendarRef.current])

  return (
    <div className="relative h-full w-full p-2">
      {/* Sticky Header with View Buttons */}
      <div className="flex justify-between items-center bg-gray-100 p-1 shadow-md sticky top-0 z-10">
        <div className="flex space-x-2">
          {zoomLevels.map((view, index) => (
            <button
              key={view.label}
              onClick={() => onZoomChange(index)}
              className={`px-3 py-1 text-sm rounded ${
                zoomIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Navigation and Next Step Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            &larr;
          </button>
          <div className="text-lg font-semibold">{currentFormattedDate}</div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="h-[60vh] w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={currentZoom.name}
          key={currentZoom.name + currentZoom.slotDuration}
          headerToolbar={false} // Disable FullCalendar's default header
          events={reservations.map((slot) => ({
            id: slot.id,
            start: slot.start,
            end: slot.end,
            backgroundColor: slot.backgroundColor
          })) as any}
          allDaySlot={false}
          slotDuration={currentZoom.slotDuration}
          slotLabelInterval={currentZoom.slotDuration}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          selectable
          select={(info) =>
            onSlotSelect({
              start: info.startStr,
              end: info.endStr,
            })
          }
          eventClick={(info) => {
            const reservation = reservations.find(
              (res) => res.id === parseInt(info.event.id)
            );
            if (reservation && reservation.canEdit) onEventClick(reservation);
          }}
          height="100%"
          contentHeight="auto"
          scrollTime="09:00:00"
        />
      </div>
    </div>
  );
};

export default FullCalendarWrapper;
