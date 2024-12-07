import { Camera, Image } from "lucide-react";
import { LocationView } from "@/pages/screens";

const ScreensGalleryView = ({ locations }: { locations: LocationView[] }) => {


  const handleUpload = (id: number) => {
    // Handle photo upload logic
    alert(`Upload clicked for item ${id}`);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {locations.map((location) => (
        <div
          key={location.id}
          className="relative bg-gray-100 border rounded-lg shadow-md p-4 hover:shadow-lg"
        >
          {/* Image Section */}
          <div className="relative h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
            {location.imageDownloadUrl ? (
              <img
                src={location.imageDownloadUrl}
                alt={location.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Image className="w-12 h-12" />
                <span>No Photo</span>
              </div>
            )}
            {/* Upload Button */}
            <button
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => handleUpload(location.id)}
            >
              <Camera className="w-6 h-6 mr-2" />
              Upload Photo
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">{location.name}</h2>
            <p className="text-gray-600">{location.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreensGalleryView;
