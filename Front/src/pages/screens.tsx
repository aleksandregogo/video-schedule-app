import { useEffect, useState } from "react";
import { MapPin, GalleryHorizontal, Plus } from "lucide-react";
import ScreensGalleryView from "@/components/screen/screens-gallery-view";
import ScreensMapView from "@/components/screen/screens-map-view";
import ScreenFormModal from "@/components/screen/modals/screen-form-modal";
import { useAuth } from "@/contexts/authProvider";
import { ScreenView, ScreenStatus } from "@/components/screen/types";
import { changeScreenStatus, createScreen, deleteScreen, deleteScreenImage, fetchScreens } from "@/actions/screen";

const Screens = () => {
  const { isCompany } = useAuth();

  const [isGalleryView, setIsGalleryView] = useState(true);
  const [screens, setScreens] = useState<ScreenView[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultScreenValues, setDefaultScreenValues] = useState<Partial<ScreenView> | null>(null);

  const refreshScreens = async () => {
    const screens = await fetchScreens(isCompany);

    if (screens) {
      setScreens(screens);
    }
  };

  useEffect(() => {
    refreshScreens();
  }, []);

  const handleAddScreen = async (newScreen: ScreenView) => {
    const created = await createScreen({
      name: newScreen.name,
      lat: Number(newScreen.lat),
      lng: Number(newScreen.lng),
      price: Number(newScreen.price),
      status: newScreen.status
    });

    if (created) {
      await refreshScreens();

      setIsModalOpen(false);
      setDefaultScreenValues(null);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setDefaultScreenValues({ lat, lng }); // Set lat/lng as default values for the modal
    setIsModalOpen(true);
  };

  const handleScreenImageChange = (imageDownloadUrl: string, screenId: number) => {
    setScreens((screens) =>
      screens.map((screen) =>
        screen.id === screenId ? { ...screen, imageDownloadUrl } : screen
      )
    );
  }

  const handleToggleStatus = async (screenId: number, newStatus: ScreenStatus) => {
    const statusChanged = await changeScreenStatus(screenId, newStatus);

    if (statusChanged) await refreshScreens();
  };
  
  const handleDelete = async (screenId: number) => {
    const screenDeleted = await deleteScreen(screenId);

    if (screenDeleted) await refreshScreens()
  };

  const handleDeleteImage = async (screenId: number) => {
    const imageDeleted = await deleteScreenImage(screenId);

    if (imageDeleted) await refreshScreens()
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Toggle Buttons */}
      <div className="flex items-center justify-between bg-gray-800 text-white py-4 px-6">
        <div className="flex gap-4">
          <button
            onClick={() => setIsGalleryView(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isGalleryView ? "bg-gray-700" : "hover:bg-gray-600"
            }`}
          >
            <GalleryHorizontal className="w-5 h-5" />
            Gallery View
          </button>
          <button
            onClick={() => setIsGalleryView(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              !isGalleryView ? "bg-gray-700" : "hover:bg-gray-600"
            }`}
          >
            <MapPin className="w-5 h-5" />
            Map View
          </button>
        </div>
        {isCompany && <button
          onClick={() => {
            setDefaultScreenValues(null); // Reset default values for a fresh modal
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Screen
        </button>}
      </div>

      {/* Render Gallery or Map */}
      <div className="flex-1 p-4 relative h-[70vh] p-4">
        {isGalleryView ? (
          <ScreensGalleryView
            screens={screens}
            onImageUpload={handleScreenImageChange}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onDeleteImage={handleDeleteImage}
          />
        ) : (
          <ScreensMapView
            screens={screens}
            isVisible={true}
            onMapClick={handleMapClick} // Handle map clicks here
          />
        )}
      </div>

      {/* Screen Form Modal */}
      {isModalOpen && (
        <ScreenFormModal
          onClose={() => {
            setIsModalOpen(false);
            setDefaultScreenValues(null); // Reset default values after modal closes
          }}
          onAddScreen={handleAddScreen}
          defaultValues={defaultScreenValues} // Pass default values to the modal
        />
      )}
    </div>
  );
};

export default Screens;
