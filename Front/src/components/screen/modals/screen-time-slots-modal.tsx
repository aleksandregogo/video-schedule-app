import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FullCalendarWrapper from "@/components/calendar/full-calendar-wrapper";
import ScreenSlotReservationModal from "@/components/screen/modals/screen-slot-reservation-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast" // Import ShadCN toast hook
import { Reservation, ReservationStatus, CalendarEvent } from "./types";
import { ScreenView } from "@/pages/screens";
import { APIClient } from "@/services/APIClient";
import { formatDateTimeLocal } from "@/lib/utils";

type Props = {
  screen: ScreenView;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const ScreenTimeSlotsModal = ({ screen, open, setOpen }: Props) => {
  const [zoomIndex, setZoomIndex] = useState(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (screen && screen.id) {
      APIClient.get(`/screen/${screen.id}/reservations`)
        .then((response) => {
          const reservations = response.data.data as Reservation[];
  
          if (reservations) {  
            const data = reservations.map(
              (reservation: Reservation) =>
                ({
                  id: reservation.id,
                  title: reservation.title,
                  status: reservation.status,
                  start: formatDateTimeLocal(reservation.start),
                  end: formatDateTimeLocal(reservation.end),
                  backgroundColor: "#f87171",
                  canEdit: false
                } as Reservation)
            );
  
            setReservations(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching screens:", err);
        });
    }
  }, [screen])

  const handleViewChange = (index: number) => setZoomIndex(index);

  const handleSlotSelect = (calendarEvent: CalendarEvent) => {
    const isReserved = reservations.some(
      (reservation) =>
        new Date(calendarEvent.start) < new Date(reservation.end) &&
        new Date(calendarEvent.end) > new Date(reservation.start)
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

    setSelectedReservation({
      ...calendarEvent,
      canEdit: true,
    });
    setReservationModalOpen(true);
  };

  const handleReservationSave = (reservation: Reservation) => {
    if (reservation.id) {
      // Update existing reservation
      setReservations((prev) =>
        prev.map((res) => (res.id === reservation.id ? reservation : res))
      );
    } else {
      const existingIds = reservations.map((res) => res.id);
      const newId = Number(existingIds.sort((a, b) => b - a)[0] || 0)+1;

      // Add a new reservation
      setReservations((prev) => [
        ...prev,
        {
          ...reservation,
          id: newId,
          status: ReservationStatus.PENDING,
          canEdit: true
        },
      ]);
    }
    setReservationModalOpen(false);
  };

  const handleReservationDelete = (id: number) => {
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
