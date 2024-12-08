import { Image, Camera, Trash2 } from "lucide-react";
import FileUploader from "./fileUploader";
import { ScreenView } from "@/pages/screens";
import { Toggle } from "@/components/ui/toggle"; // Ensure this path points to your ShadCN Toggle component
import { Button } from "@/components/ui/button"; // Ensure this path points to your ShadCN Button component

type ScreensGalleryViewProps = {
  screens: ScreenView[];
  onImageUpload?: (imageDownloadUrl: string, screenId: number) => void; // Callback after upload completion
  onToggleStatus: (screenId: number, newStatus: string) => void; // Callback for toggling enable/disable
  onDelete: (screenId: number) => void; // Callback for deleting a screen
};

const ScreensGalleryView = ({
  screens,
  onImageUpload,
  onToggleStatus,
  onDelete,
}: ScreensGalleryViewProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {screens.map((screen) => (
        <div
          key={screen.id}
          className="relative bg-gray-100 border rounded-lg shadow-md p-4 hover:shadow-lg"
        >
          {/* Image Section */}
          <div className="relative h-40 w-full bg-gray-200 rounded-lg overflow-hidden">
            {screen.imageDownloadUrl ? (
              <img
                src={screen.imageDownloadUrl}
                alt={screen.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Image className="w-12 h-12" />
                  <span>No Photo</span>
                </div>
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
          <div className="mt-4 flex justify-between items-center">
            {/* Enable/Disable Toggle */}
            <Toggle
              pressed={screen.status === "ON"}
              onPressedChange={(pressed) =>
                onToggleStatus(screen.id, pressed ? "ON" : "OFF")
              }
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              {screen.status === "ON" ? "Disable" : "Enable"}
            </Toggle>

            <Button
              variant="destructive"
              onClick={() => onDelete(screen.id)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreensGalleryView;
