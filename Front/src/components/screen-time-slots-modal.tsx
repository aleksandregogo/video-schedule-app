import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { ScreenView } from "@/pages/screens";
import "@/styles/calendar.css"; // Import the scrollbar styles

type Props = {
  screen: ScreenView;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ScreenTimeSlotsModal = ({ screen, open, setOpen }: Props) => {
  if (!screen) return null;

  // View levels with corresponding slot durations
  const zoomLevels = [
    { name: "timeGridWeek", label: "Week View", slotDuration: "01:00:00" },
    { name: "timeGridDay", label: "Day View", slotDuration: "00:30:00" },
    { name: "timeGridDay", label: "Hour View", slotDuration: "00:15:00" },
    { name: "timeGridDay", label: "Minute View", slotDuration: "00:05:00" },
  ];

  const [zoomIndex, setZoomIndex] = useState(1); // Default: Day View
  const currentZoom = zoomLevels[zoomIndex];

  const handleViewChange = (index: number) => {
    setZoomIndex(index);
  };

  const events = screen.availableTimeSlots
    ? screen.availableTimeSlots.map((slot) => ({
        title: "Available",
        start: slot.start,
        end: slot.end,
        color: "#22c55e",
      }))
    : [
        { start: "2024-12-18T09:00:00", end: "2024-12-18T10:00:00" },
        { start: "2024-12-18T12:00:00", end: "2024-12-18T13:00:00" },
      ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[90vw] h-[90vh] p-0 rounded-lg shadow-lg">
        {/* Header with View Change Buttons */}
        <div className="flex items-center justify-between px-6 pt-4 bg-gray-100 relative rounded-lg">
          {/* View Change Buttons at Start */}
          <div className="flex space-x-2 pb-4">
            {zoomLevels.map((view, index) => (
              <button
                key={view.name}
                onClick={() => handleViewChange(index)}
                className={`px-3 py-1 text-sm rounded ${
                  zoomIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Centered Dialog Title */}
          <DialogTitle className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold pb-4">
            {screen.name}
          </DialogTitle>
        </div>


        {/* FullCalendar */}
        <div className="h-[calc(100%-4rem)] w-full overflow-auto bg-white">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={currentZoom.name}
            key={currentZoom.name + currentZoom.slotDuration} // Force re-render on view change
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              end: "",
            }}
            events={events}
            allDaySlot={false}
            slotDuration={currentZoom.slotDuration} // Adjust slot duration dynamically
            slotLabelInterval={currentZoom.slotDuration}
            slotMinTime="00:00:00"
            slotMaxTime="23:59:00"
            selectable={true}
            select={(info) =>
              alert(`Selected range: ${info.startStr} to ${info.endStr}`)
            }
            eventClick={(info) =>
              alert(`Clicked on slot: ${info.event.title}`)
            }
            height="auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenTimeSlotsModal;
