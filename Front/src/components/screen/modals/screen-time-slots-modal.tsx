import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FullCalendarWrapper from "@/components/calendar/full-calendar-wrapper";
import ScreenSlotReservationModal from "@/components/screen/modals/screen-slot-reservation-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast" // Import ShadCN toast hook
import { Reservation, SelectedTime } from "./types";

type Props = {
  screen: { name: string; reservations: Reservation[] };
  open: boolean;
  setOpen: (value: boolean) => void;
};

const ScreenTimeSlotsModal = ({ screen, open, setOpen }: Props) => {
  const [zoomIndex, setZoomIndex] = useState(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<SelectedTime | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (screen && screen.reservations) {
      setReservations(screen.reservations)
    }
  }, [screen])

  const handleViewChange = (index: number) => setZoomIndex(index);

  const handleSlotSelect = (selectedTime: SelectedTime) => {
    const isReserved = reservations.some(
      (reservation) =>
        new Date(selectedTime.start) < new Date(reservation.end) &&
        new Date(selectedTime.end) > new Date(reservation.start)
    );

    if (isReserved) {
      toast({
        title: "Time Slot Unavailable",
        description: "The selected time slot is already reserved.",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    setSelectedReservation(selectedTime);
    setReservationModalOpen(true);
  };

  const handleReservationSave = (reservation: Reservation) => {
    if (reservation.id) {
      // Update existing reservation
      setReservations((prev) =>
        prev.map((res) => (res.id === reservation.id ? reservation : res))
      );
    } else {
      // Add a new reservation
      setReservations((prev) => [
        ...prev,
        { ...reservation, id: crypto.randomUUID() },
      ]);
    }
    setReservationModalOpen(false);
  };

  const handleReservationDelete = (id: string) => {
    setReservations((prev) => prev.filter((res) => res.id !== id));
    setReservationModalOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[90vh] p-0 rounded-lg shadow-lg bg-white">
        {/* Calendar with Integrated Header */}
        <div className="h-full">
          <FullCalendarWrapper
            screen={screen}
            reservations={reservations}
            zoomIndex={zoomIndex}
            onZoomChange={handleViewChange}
            onSlotSelect={handleSlotSelect}
            onEventClick={(reservation) => {
              setSelectedReservation(reservation);
              setReservationModalOpen(true);
            }}
            onNextStep={() => {
              alert("Next step logic triggered!");
            }}
          />
        </div>
      </DialogContent>

      {/* Reservation Modal */}
      {reservationModalOpen && selectedReservation && (
        <ScreenSlotReservationModal
          reservation={selectedReservation}
          onSave={handleReservationSave}
          onDelete={handleReservationDelete}
          onClose={() => setReservationModalOpen(false)}
        />
      )}
    </Dialog>
  );
};

export default ScreenTimeSlotsModal;
