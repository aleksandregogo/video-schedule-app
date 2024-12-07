import { useEffect, useState } from 'react';
import { APIClient } from '@/services/APIClient';
import { MapPin, GalleryHorizontal } from 'lucide-react';
import ScreensGalleryView from '@/components/screens-gallery-view';
import ScreensMapView from '@/components/screens-map-view';

export interface LocationView {
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
  const [locations, setLocations] = useState<LocationView[]>([]);

  useEffect(() => {
    APIClient.get('/location/all')
      .then((response) => {
        const data = response.data.data.map((location: LocationView) => ({
          id: location.id,
          name: location.name,
          status: location.status,
          lat: location.lat,
          lng: location.lng,
          imageDownloadUrl: location.imageDownloadUrl,
          price: location.price,
          companyId: location.companyId,
        } as LocationView));

        setLocations(data);
      })
      .catch((err) => {
        console.error('Error fetching locations:', err);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Toggle Buttons */}
      <div className="flex items-center justify-center bg-gray-800 text-white py-4">
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

      {/* Render Gallery or Map */}
      <div className="flex-1 p-4 relative h-[70vh]">
        {isGalleryView ? <ScreensGalleryView locations={locations} /> : <ScreensMapView locations={locations} isVisible />}
      </div>
    </div>
  );
};

export default Screens;
