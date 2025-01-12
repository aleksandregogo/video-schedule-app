import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import Schedule from "@/components/schedule/schedule";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import CampaignSubmitModalHeader from "./campaign-submit-modal-header";
import { Reservation } from "@/components/screen/types";
import { CampaignView } from "@/pages/campaigns";
import FileUploader from "@/components/file-uploader";
import { Clapperboard, Trash2 } from "lucide-react";

type Props = {
  campaign: CampaignView;
  step: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onSubmit: (reservations: Reservation[], name: string) => void;
  onEditTime: () => void;
  onMediaDelete: () => void;
};

const CampaignSubmitModal = ({
  campaign,
  step,
  onStepChange,
  onClose,
  onSubmit,
  onEditTime,
  onMediaDelete
}: Props) => {
  const [changedCampaignTitle, setChangedCampaignTitle] = useState<string>(campaign.name);
  const [reservations, setReservations] = useState<Reservation[]>(campaign?.reservations || []);
  const [totalPrice, setTotalPrice] = useState<string>('0');

  const [mediaUrl, setMediaUrl] = useState<string>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  useEffect(() => {
    if (campaign) {
      setMediaUrl(campaign.mediaUrl || null);
    }
  }, [campaign])

  const handleDurationSubmit = () => {

    const fixedReservations = reservations.map((reservation) => {
      const startTime = new Date(reservation.start);
      const endTime = startTime;

      endTime.setSeconds(endTime.getSeconds() + Math.round(videoDuration));
      
      return {
        ...reservation,
        end: endTime.toISOString()
      };
    });

    if (fixedReservations?.length) {
      setTotalPrice((fixedReservations.length * videoDuration * campaign.screen.price).toFixed(2));
      setReservations(fixedReservations);
      onStepChange(1)
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[80vh] p-0 rounded-lg shadow-lg bg-white">
        <CampaignSubmitModalHeader
          name={campaign.name}
          step={step}
          setStep={onStepChange}
        />
        {step === 0 ? (
          <div className="relative h-80 w-50 m-4">
            <h1 className="text-2xl font-bold p-2 mb-2">Upload media</h1>
              {mediaUrl ? 
                <>
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoDuration(videoRef.current.duration);
                      }
                    }}
                    controls
                    className="bg-black w-full h-full"
                  />
                  <Button
                    variant="destructive"
                    onClick={onMediaDelete}
                    className="my-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>

                  {videoDuration > 0 && <>
                    <p>
                      Your media duration in seconds: <span className="text-lg font-semibold">{videoDuration.toFixed(1) || 0}</span>
                    </p>
                    <p>Selected time slots will be corrected by this duration.</p>
                    <div>
                      <Label htmlFor="text-input"> Click continue to do so</Label>
                      <Button variant="default" className="ml-2" onClick={handleDurationSubmit}>
                        Submit
                      </Button>
                    </div>
                  </>}
                </> :
                <div className="relative h-80 w-50 bg-gray-200 rounded-lg overflow-hidden">
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    <FileUploader
                      ownerId={campaign.id}
                      uploadEndpoint="/campaign/media/upload-request"
                      completeEndpoint="/campaign/media/upload-complete"
                      onComplete={(mediaDownloadUrl) => setMediaUrl(mediaDownloadUrl)}
                    >
                      <Clapperboard className="w-6 h-6 mr-2" />
                      Upload media
                    </FileUploader>
                  </button>
                </div>
              }
          </div>
        ) : (
          <>
            <Schedule
              selectedReservations={reservations}
              setReservations={(reservations) => setReservations(reservations)}
              title={changedCampaignTitle}
              setTitle={(title) => setChangedCampaignTitle(title)}
              onEditTime={onEditTime}
              maxHeight="h-[30vh]"
            />
            <div className="m-4">
              <p>
                Your media duration in seconds: <span className="text-lg font-semibold">{videoDuration.toFixed(1) || 0}</span>
              </p>
              <p>
                Time slots is already corrected by video duration.
              </p>
              <p className="text-sm font-medium text-gray-700">
                Total price is: <span className="text-lg font-semibold">{totalPrice}$</span>
              </p>
              <div>
                <Label htmlFor="text-input"> You can now request review</Label>
                <Button variant="default" className="ml-2" onClick={() => onSubmit(reservations, changedCampaignTitle)}>
                  Request review
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignSubmitModal;
