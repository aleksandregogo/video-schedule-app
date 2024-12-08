import { useEffect, useState } from "react";
import { APIClient } from "@/services/APIClient";
import { MapPin, GalleryHorizontal, Plus } from "lucide-react";
import ScreensGalleryView from "@/components/screens-gallery-view";
import ScreensMapView from "@/components/screens-map-view";
import ScreenFormModal from "@/components/screen-form-modal";

export interface ScreenView {
  id: number;
  name: string;
  status: string;
  lat: number;
  lng: number;
  imageDownloadUrl?: string;
  price: number;
  companyId: number;
}

const Screens = () => {
  const [isGalleryView, setIsGalleryView] = useState(true);
  const [screens, setScreens] = useState<ScreenView[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultScreenValues, setDefaultScreenValues] = useState<Partial<ScreenView> | null>(null);

  const fetchScreens = () => {
    APIClient.get("/screen/all")
      .then((response) => {
        const data = response.data.data.map(
          (screen: ScreenView) =>
            ({
              id: screen.id,
              name: screen.name,
              status: screen.status,
              lat: screen.lat,
              lng: screen.lng,
              imageDownloadUrl: screen.imageDownloadUrl,
              price: screen.price,
              companyId: screen.companyId,
            } as ScreenView)
        );
        setScreens(data);
      })
      .catch((err) => {
        console.error("Error fetching screens:", err);
      });
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleAddScreen = (newScreen: ScreenView) => {
    APIClient.post("/screen/create", {
      name: newScreen.name,
      lat: Number(newScreen.lat),
      lng: Number(newScreen.lng),
      price: Number(newScreen.price),
      status: newScreen.status
    })
      .then(() => fetchScreens())
      .catch((err) => {
        console.error("Error creating screen:", err);
      })
      .finally(() => {
        setIsModalOpen(false);
        setDefaultScreenValues(null);
      })
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

  const handleToggleStatus = (screenId: number, newStatus: string) => {
    console.log(screenId);
    // setScreens((prevScreens) =>
    //   prevScreens.map((screen) =>
    //     screen.id === screenId ? { ...screen, status: newStatus } : screen
    //   )
    // );
  };
  
  const handleDelete = (screenId: number) => {
    console.log(screenId);
    // setScreens((prevScreens) =>
    //   prevScreens.filter((screen) => screen.id !== screenId)
    // );
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
        <button
          onClick={() => {
            setDefaultScreenValues(null); // Reset default values for a fresh modal
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Screen
        </button>
      </div>

      {/* Render Gallery or Map */}
      <div className="flex-1 p-4 relative h-[70vh]">
        {isGalleryView ? (
          <ScreensGalleryView
            screens={screens}
            onImageUpload={handleScreenImageChange}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
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
