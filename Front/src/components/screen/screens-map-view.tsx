import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css";
import { ScreenView } from "./types";

interface ScreensMapViewProps {
  screens: ScreenView[];
  isVisible: boolean;
  onMapClick: (lat: number, lng: number) => void; // Callback for map clicks
}

const ScreensMapView: React.FC<ScreensMapViewProps> = ({ screens, isVisible, onMapClick }) => {
  return (
    <div className="relative h-[70vh] w-full">
      <MapContainer
        center={{
          lat: 41.716573082982926,
          lng: 44.785917937701704,
        }}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapResizeHandler isVisible={isVisible} />
        {/* <MapClickHandler onClick={onMapClick} /> */}
        {screens.map((screen, index) => (
          <Marker
            key={index}
            position={{
              lat: screen.lat,
              lng: screen.lng,
            }}
          >
            <Popup>
              <div className="flex flex-col items-center">
                {/* Display Screen Image */}
                <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                  {screen.imageDownloadUrl ? (
                    <img
                      src={screen.imageDownloadUrl}
                      alt={screen.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <span>No Photo</span>
                    </div>
                  )}
                </div>
                {/* Display Screen Info */}
                <div className="mt-2 text-center">
                  <h3 className="text-lg font-semibold">{screen.name}</h3>
                  <p className="text-sm text-gray-600">Price: ${screen.price}</p>
                  <p className="text-sm text-gray-600">Status: {screen.status}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Handles resizing of the map when toggled
const MapResizeHandler: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const map = useMap();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
    }
  }, [isVisible, map]);

  return null;
};

// Handles map clicks
const MapClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvent("click", (e) => {
    return onClick(e.latlng.lat, e.latlng.lng);
  });
  return null;
};

export default ScreensMapView;
