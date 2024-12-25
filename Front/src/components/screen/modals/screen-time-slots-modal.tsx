import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FullCalendarWrapper from "@/components/calendar/full-calendar-wrapper";
import ScreenSlotReservationModal from "@/components/screen/modals/screen-slot-reservation-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { Reservation, ReservationStatus, CalendarEvent } from "../types";
import { ScreenView } from "@/pages/screens";
import { APIClient } from "@/services/APIClient";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/utils";
import Schedule from "@/components/schedule/schedule";
import { Button } from "@/components/ui/button";
import ScreenModalHeader from "./screen-modal-header";

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

  const [viewStep, setViewStep] = useState<number>(0);
  const [campaignTitle, setCampaignTitle] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>();

  const { toast } = useToast();

  const fetchScreens = async (screenId: number) => {
    await APIClient.get(`/screen/${screenId}/reservations`)
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

  useEffect(() => {
    if (screen && screen.id) fetchScreens(screen.id)
  }, [screen]);

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
        duration: 2000,
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
      const newId = Number(existingIds.sort((a, b) => b - a)[0] || 0) + 1;

      // Add a new reservation
      setReservations((prev) => [
        ...prev,
        {
          ...reservation,
          id: newId,
          status: ReservationStatus.PENDING,
          canEdit: true,
        },
      ]);
    }

    setReservationModalOpen(false);
  };

  const handleReservationDelete = (id: number) => {
    setReservations((prev) => prev.filter((res) => res.id !== id));
    setReservationModalOpen(false);
  };

  const handleCreateCampaign = () => {
    const reservedTimes = [];

    reservations.forEach((reservation) => {
      if (reservation.canEdit) {
        reservedTimes.push({
          name: reservation.title,
          startTime: new Date(reservation.start),
          endTime: new Date(reservation.end),
        });
      }
    })

    if (!reservedTimes.length) {
      console.error("Reserved times is empty");
      return;
    }

    APIClient.post(`/campaign`, {
      name: campaignTitle,
      screenId: screen.id,
      reservations: reservedTimes
    })
      .then((response) => {
        const data = response.data;
        if (data && data.id) {
          setCampaignId(data.id);
          setViewStep(2);
        } else {
          console.error("Error creating campaign", response?.data);
        }
      })
      .catch((err) => {
        console.error("Error creating campaign:", err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[80vh] p-0 rounded-lg shadow-lg bg-white">
        {viewStep < 2 &&
          <ScreenModalHeader
            name={screen?.name}
            step={viewStep}
            setStep={setViewStep}
            reservationAdded={reservations.some((s) => s.canEdit)}
          />
        }
        {viewStep === 0 ? (
          <FullCalendarWrapper
            reservations={reservations}
            zoomIndex={zoomIndex}
            onZoomChange={handleViewChange}
            onSlotSelect={handleSlotSelect}
            onEventClick={(reservation) => {
              setSelectedReservation(reservation);
              setReservationModalOpen(true);
            }}
          />
        ) : viewStep === 1 ? (
          <Schedule
            selectedReservations={reservations}
            setReservations={(reservations) => setReservations(reservations)}
            title={campaignTitle}
            setTitle={(title) => setCampaignTitle(title)}
            handleCreate={handleCreateCampaign}
          />
        ) : (
          <div className="p-6 flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-semibold text-green-600">Campaign Created Successfully!</h2>
            <p className="text-gray-700 text-center">
              Your campaign "<strong>{campaignTitle}</strong>" has been created successfully.
            </p>
            <div className="flex space-x-4">
              <Button onClick={async () => {
                await fetchScreens(screen.id);
                setViewStep(0);
                setCampaignTitle('');
              }} variant="outline">
                Back
              </Button>
              <Button
                onClick={() => window.location.href = `/campaigns${campaignId && `/${campaignId}`}`}
              >
                Go to Campaign
              </Button>
            </div>
          </div>
        )}
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
