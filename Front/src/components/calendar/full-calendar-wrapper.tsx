import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";
import "@/styles/calendar.css";
import { CalendarEvent, Reservation, SelectedTime } from "../screen/modals/types";

type Props = {
  screen: { name: string; };
  reservations: Reservation[];
  zoomIndex: number;
  onZoomChange: (index: number) => void;
  onSlotSelect: (selectedTime: SelectedTime) => void;
  onEventClick: (reservation: Reservation) => void;
  onNextStep: () => void; // Callback for the Next Step button
};

const zoomLevels = [
  { label: "Week View", name: "timeGridWeek", slotDuration: "01:00:00" },
  { label: "Day View", name: "timeGridDay", slotDuration: "00:30:00" },
  { label: "Hour View", name: "timeGridDay", slotDuration: "00:15:00" },
  { label: "Minute View", name: "timeGridDay", slotDuration: "00:05:00" },
];

const FullCalendarWrapper = ({
  screen,
  reservations,
  zoomIndex,
  onZoomChange,
  onSlotSelect,
  onEventClick,
  onNextStep,
}: Props) => {
  const currentZoom = zoomLevels[zoomIndex];
  const calendarRef = useRef<FullCalendar>(null);

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
  };

  const events: CalendarEvent[] = reservations.map((slot) => ({
    start: slot.start,
    end: slot.end,
    backgroundColor: slot.backgroundColor,
  }));

  return (
    <div className="relative h-full w-full">
      {/* Sticky Header with View Buttons */}
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md sticky top-0 z-10">
        {/* View Change Buttons */}
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

        {/* Calendar Title */}
        <h2 className="text-lg font-semibold">{screen.name}</h2>

        {/* Navigation and Next Step Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Next
          </button>
          <button
            onClick={onNextStep}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={currentZoom.name}
          key={currentZoom.name + currentZoom.slotDuration}
          headerToolbar={false} // Disable FullCalendar's default header
          events={events}
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
              (res) => res.id === info.event.id
            );
            if (reservation) onEventClick(reservation);
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
