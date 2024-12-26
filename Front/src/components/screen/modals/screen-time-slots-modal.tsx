import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FullCalendarWrapper from "@/components/calendar/full-calendar-wrapper";
import ScreenSlotReservationModal from "@/components/screen/modals/screen-slot-reservation-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { Reservation, ReservationStatus, CalendarEvent } from "../types";
import { ScreenView } from "@/pages/screens";
import { APIClient } from "@/services/APIClient";
import Schedule from "@/components/schedule/schedule";
import { Button } from "@/components/ui/button";
import ScreenModalHeader from "./screen-modal-header";
import { Label } from "@radix-ui/react-label";

type Props = {
  screen: ScreenView;
  screenReservations: Reservation[];
  onClose: () => void;
  reloadReservations: () => void;
};

const ScreenTimeSlotsModal = ({ screen, screenReservations, onClose, reloadReservations }: Props) => {
  const [zoomIndex, setZoomIndex] = useState(2);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const [viewStep, setViewStep] = useState<number>(0);
  const [campaignTitle, setCampaignTitle] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>();

  const [price, setPrice] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    if (screenReservations) setReservations(screenReservations)
  }, [screenReservations]);

  useEffect(() => {
    if (reservations && screen?.price) {
      const newReservations = reservations.filter((res) => res.canEdit);

      if (newReservations?.length) {
        let fullCalculatedPrice = 0;
        
        newReservations.forEach((reservation) => {
          const start = new Date(reservation.start);
          const end = new Date(reservation.end);
          const calculatedDuration = Math.round((end.getTime() - start.getTime()) / 1000);

          fullCalculatedPrice += calculatedDuration * screen.price;
        });

        if (fullCalculatedPrice) setPrice(fullCalculatedPrice);
      } else {
        setPrice(0)
      }
    }
  }, [reservations, screen])

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
    <Dialog open={true} onClose={onClose}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[80vh] p-0 rounded-lg shadow-lg bg-white">
        {viewStep < 2 &&
          <ScreenModalHeader
            name={screen?.name}
            step={viewStep}
            setStep={setViewStep}
            reservationAdded={reservations.some((s) => s.canEdit)}
            handleCreate={handleCreateCampaign}
            disableCreate={campaignTitle === '' || !reservations.some((s) => s.confirmed)}
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
          />
        ) : (
          <div className="p-6 flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-semibold text-green-600">Campaign Created Successfully!</h2>
            <p className="text-gray-700 text-center">
              Your campaign "<strong>{campaignTitle}</strong>" has been created successfully.
            </p>
            <div className="flex space-x-4">
              <Button onClick={async () => {
                reloadReservations();
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
        {viewStep < 2 && <div className="flex justify-between items-center p-2">
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
              Calculated Price: <span className="text-lg font-semibold">{price}$</span>
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
