import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FullCalendarWrapper from "@/components/calendar/full-calendar-wrapper";
import ScreenSlotReservationModal from "@/components/screen/modals/screen-slot-reservation-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { Reservation, ReservationStatus, CalendarEvent } from "../types";
import { ScreenView } from "@/pages/screens";
import Schedule from "@/components/schedule/schedule";
import { Button } from "@/components/ui/button";
import ScreenModalHeader from "./screen-modal-header";
import { Label } from "@radix-ui/react-label";

type Props = {
  price: number;
  title: string;
  reservedSlots: Reservation[];
  step: number;
  isEditMode?: boolean;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onReloadReservations: () => void;
  onReservationsSubmit: (reservations: Reservation[], name: string) => void;
};

const ScreenTimeSlotsModal = ({
  title,
  price = 0,
  reservedSlots,
  step,
  isEditMode = false,
  onStepChange,
  onClose,
  onReloadReservations,
  onReservationsSubmit
}: Props) => {
  const { toast } = useToast();

  const [zoomIndex, setZoomIndex] = useState(2);
  const [reservations, setReservations] = useState<Reservation[]>(reservedSlots || []);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [changedCampaignTitle, setChangedCampaignTitle] = useState<string>(isEditMode && title ? title : '');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (reservations && price) {
      const newReservations = reservations.filter((res) => res.canEdit);

      if (newReservations?.length) {
        let fullCalculatedPrice = 0;
        
        newReservations.forEach((reservation) => {
          const start = new Date(reservation.start);
          const end = new Date(reservation.end);
          const calculatedDuration = Math.round((end.getTime() - start.getTime()) / 1000);

          fullCalculatedPrice += calculatedDuration * price;
        });

        if (fullCalculatedPrice) setTotalPrice(fullCalculatedPrice);
      } else {
        setTotalPrice(0)
      }
    }
  }, [reservations, price])

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

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[80vh] p-0 rounded-lg shadow-lg bg-white">
        {step < 2 &&
          <ScreenModalHeader
            name={title}
            step={step}
            setStep={onStepChange}
            reservationAdded={reservations.some((s) => s.canEdit)}
            handleCreate={() => onReservationsSubmit(reservations, changedCampaignTitle)}
            disableCreate={changedCampaignTitle === '' || !reservations.some((s) => s.confirmed)}
            isEditMode={isEditMode}
          />
        }
        {step === 0 ? (
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
        ) : step === 1 ? (
          <Schedule
            selectedReservations={reservations}
            setReservations={(reservations) => setReservations(reservations)}
            title={changedCampaignTitle}
            setTitle={(title) => setChangedCampaignTitle(title)}
            maxHeight="45vh"
          />
        ) : (
          <div className="p-6 flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-semibold text-green-600">Campaign Created Successfully!</h2>
            <p className="text-gray-700 text-center">
              Your campaign "<strong>{changedCampaignTitle}</strong>" has been created successfully.
            </p>
            <div className="flex space-x-4">
              <Button onClick={async () => {
                onReloadReservations();
                onStepChange(0);
                setChangedCampaignTitle('');
              }} variant="outline">
                Back
              </Button>
              <Button
                onClick={() => window.location.href = '/campaigns'}
              >
                Go to Campaign
              </Button>
            </div>
          </div>
        )}
        {step < 2 && <div className="flex justify-between items-center p-2">
          {/* Duration Input */}
          <div className="flex items-center space-x-4">
            <Label className="text-sm font-medium">
              Prices is calculated for <b>1 minute</b> video. Later it will be recalculated by video duration that you'll upload.
            </Label>
            {/* <Label className="w-full text-sm font-medium">Media duration (seconds):</Label> */}
            {/* <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1"
            /> */}
          </div>

          {/* Price Display */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              Approximately Price will be: <span className="text-lg font-semibold">{totalPrice}$</span>
            </p>
          </div>
        </div>}
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
