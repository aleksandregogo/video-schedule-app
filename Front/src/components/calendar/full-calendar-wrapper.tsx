import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";
import "@/styles/calendar.css";
import { Reservation, CalendarEvent } from "../screen/modals/types";
import CalendarHeader from "./calendar-header";

type Props = {
  screen: { name: string; };
  reservations: Reservation[];
  zoomIndex: number;
  onZoomChange: (index: number) => void;
  onSlotSelect: (calendarEvent: CalendarEvent) => void;
  onEventClick: (reservation: Reservation) => void;
  onNextStep: () => void;
};

const zoomLevels = [
  { label: "Week", name: "timeGridWeek", slotDuration: "01:00:00" },
  { label: "Day", name: "timeGridDay", slotDuration: "00:30:00" },
  { label: "Hour", name: "timeGridDay", slotDuration: "00:15:00" },
  { label: "Minute", name: "timeGridDay", slotDuration: "00:05:00" },
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

  return (
    <div className="relative h-full w-full">
      {/* Sticky Header with View Buttons */}
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md sticky top-0 z-10">
        <CalendarHeader 
          zoomLevels={zoomLevels}
          zoomIndex={zoomIndex}
          onZoomChange={onZoomChange}
        />

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
            disabled={reservations.length === 0}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
          >
            Next
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
            console.log("onclik", reservation)
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
