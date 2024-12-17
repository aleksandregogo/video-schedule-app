import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { ScreenView } from "@/pages/screens";

type Props = {
  screen: ScreenView;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ScreenTimeSlotsModal = ({ screen, open, setOpen }: Props) => {
  if (!screen) return <>Loading...</>;

  let events = [
    { start: "2024-06-28T09:00:00", end: "2024-06-28T10:00:00" },
    { start: "2024-06-28T12:00:00", end: "2024-06-28T13:00:00" },
  ];

  if (screen.availableTimeSlots) {
    events = screen.availableTimeSlots.map((slot) => ({
      title: "Available",
      start: slot.start,
      end: slot.end,
      color: "#22c55e",
    }));
  }

  const handleSlotClick = (info) => {
    alert(`Selected slot: ${info.event.start} to ${info.event.end}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full max-w-[90vw] h-[90vh] p-0 overflow-hidden"
      >
        <DialogTitle className="text-2xl font-bold px-6 pt-4">
          {screen.name}
        </DialogTitle>
        <div className="h-[calc(100%-3rem)] w-full px-6 pb-6 overflow-hidden">
          {/* FullCalendar Container */}
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              end: "timeGridDay,timeGridWeek",
            }}
            events={events}
            eventClick={handleSlotClick}
            allDaySlot={false}
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
            height="100%"
            contentHeight="auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenTimeSlotsModal;
