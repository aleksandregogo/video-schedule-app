import { useState } from "react";
import { Image, Camera, Trash2, CalendarPlus } from "lucide-react";
import FileUploader from "../fileUploader";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authProvider";
import ConfirmationModal from "@/components/ui/confirmation-modal"; 
import ScreenTimeSlotsModal from "./modals/screen-time-slots-modal";
import "@/styles/calendar.css";
import { Reservation, ScreenStatus, ScreenView } from "./types";
import { formatDateTimeLocal } from "@/lib/utils";
import { createCampaign } from "@/actions/campaign";
import { fetchReservations } from "@/actions/reservation";

type ScreensGalleryViewProps = {
  screens: ScreenView[];
  onImageUpload?: (imageDownloadUrl: string, screenId: number) => void;
  onToggleStatus: (screenId: number, newStatus: ScreenStatus) => void;
  onDelete: (screenId: number) => void;
  onDeleteImage: (screenId: number) => void;
};

const ScreensGalleryView = ({
  screens,
  onImageUpload,
  onToggleStatus,
  onDelete,
  onDeleteImage,
}: ScreensGalleryViewProps) => {
  const { user, isCompany } = useAuth();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [screenModalStep, setScreenModalStep] = useState(0);

  const [selectedScreen, setSelectedScreen] = useState<ScreenView | null>(null);
  const [selectedScreenReservations, setSelectedScreenReservations] = useState<Reservation[]>([]);

  const handleBook = async (screen: ScreenView) => {
    await fetchScreenReservations(screen.id);
    setSelectedScreen(screen);
    setScreenModalOpen(true);
  };

  const handleDelete = (screen: ScreenView) => {
    setSelectedScreen(screen);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedScreen && selectedScreen.id) {
      onDelete(selectedScreen.id);
    }
    setDeleteModalOpen(false);
    setSelectedScreen(null);
  };

  const fetchScreenReservations = async (screenId: number) => {
    const reservations = await fetchReservations(screenId, 'screen')

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

      setSelectedScreenReservations(data);
    }
  }

  const handleCreateCampaign = async (reservations: Reservation[], name: string) => {
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

    const created = await createCampaign({
      name,
      screenId: selectedScreen.id,
      reservations: reservedTimes
    });

    if (created) setScreenModalStep(2);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="relative bg-gray-100 border rounded-lg shadow-md p-4 hover:shadow-lg"
          >
            {/* Image Section */}
            <div className="relative h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
              {screen.imageDownloadUrl ? (
                <>
                  <img
                    src={screen.imageDownloadUrl}
                    alt={screen.name}
                    className="h-full w-full object-cover"
                  />
                  {isCompany && <Button
                    variant="destructive"
                    onClick={() => onDeleteImage(screen.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <Image className="w-12 h-12" />
                    <span>No Photo</span>
                  </div>
                  {isCompany && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity">
                      <FileUploader
                        ownerId={screen.id}
                        uploadEndpoint="/screen/media/upload-request"
                        completeEndpoint="/screen/media/upload-complete"
                        onComplete={(imageDownloadUrl) =>
                          onImageUpload && onImageUpload(imageDownloadUrl, screen.id)
                        }
                      >
                        <Camera className="w-6 h-6 mr-2" />
                        Upload Photo
                      </FileUploader>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">{screen.name}</h2>
              <p className="text-gray-600">Price: ${screen.price}</p>
              <p className="text-gray-600">Status: {screen.status}</p>
            </div>

            {/* Action Buttons */}
            {isCompany ? (
              <div className="mt-4 flex justify-between items-center">
                {/* Enable/Disable Toggle */}
                <Toggle
                  pressed={screen.status === ScreenStatus.ON}
                  onPressedChange={(pressed) =>
                    onToggleStatus(
                      screen.id,
                      pressed ? ScreenStatus.ON : ScreenStatus.OFF
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                  {screen.status === ScreenStatus.ON ? "Disable" : "Enable"}
                </Toggle>

                {/* Delete Button */}
                {screen.status === ScreenStatus.OFF && <Button
                  variant="destructive"
                  onClick={() => handleDelete(screen)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </Button>}
              </div>
            ) : (
              user && <Button
                onClick={() => handleBook(screen)}
                className="flex items-center gap-2"
              >
                <CalendarPlus className="w-5 h-5" />
                Book
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Screen schedule modal */}
      {screenModalOpen && <ScreenTimeSlotsModal
        title={selectedScreen?.name}
        price={selectedScreen?.price}
        reservedSlots={selectedScreenReservations}
        step={screenModalStep}
        onStepChange={setScreenModalStep}
        onClose={() => setScreenModalOpen(false)}
        onReloadReservations={() => fetchScreenReservations(selectedScreen.id)}
        onReservationsSubmit={handleCreateCampaign}
      />}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <ConfirmationModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Screen"
          description="Are you sure you want to delete this screen? This action cannot be undone."
        />
      )}
    </>
  );
};

export default ScreensGalleryView;
