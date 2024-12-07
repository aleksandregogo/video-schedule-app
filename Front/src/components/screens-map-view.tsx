import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css"
import { LocationView } from "@/pages/screens";

interface ScreensMapViewProps {
  locations: LocationView[];
  isVisible: boolean;
}

const ScreensMapView: React.FC<ScreensMapViewProps> = ({ locations, isVisible }) => {
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
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Component to handle resizing
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

export default ScreensMapView;