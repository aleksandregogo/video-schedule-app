import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import Schedule from "@/components/schedule/schedule";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import ReviewSubmitModalHeader from "./review-submit-modal-header";
import { Reservation } from "@/components/screen/types";
import { CampaignView } from "@/components/campaign/types";

type Props = {
  campaign: CampaignView;
  step: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
};

const ReviewSubmitModal = ({
  campaign,
  step,
  onStepChange,
  onClose,
  onConfirm,
  onReject
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

  const calculatePrice = (duration: number) => {
    const fixedReservations = reservations.map((reservation) => {
      const startTime = new Date(reservation.start);
      const endTime = startTime;

      endTime.setSeconds(endTime.getSeconds() + Math.round(duration));
      
      return {
        ...reservation,
        end: endTime.toISOString()
      };
    });

    if (fixedReservations?.length) {
      setTotalPrice((fixedReservations.length * duration * campaign.screen.price).toFixed(2));
      setReservations(fixedReservations);
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle hidden></DialogTitle>
      <DialogContent className="w-full max-w-[90vw] h-[80vh] p-0 rounded-lg shadow-lg bg-white">
        <ReviewSubmitModalHeader
          name={campaign.name}
          step={step}
          setStep={onStepChange}
          showNextStep={videoDuration > 0}
        />
        {step === 0 ? (
          <div className="relative h-80 w-50 m-4">
            <h1 className="text-2xl font-bold p-2 mb-2">Upload media</h1>
              {mediaUrl &&
                <>
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoDuration(videoRef.current.duration);
                        calculatePrice(videoRef.current.duration);
                      }
                    }}
                    controls
                    className="bg-black w-full h-full"
                  />

                  {videoDuration > 0 && <>
                    <p>
                      Media duration in seconds: <span className="text-lg font-semibold">{videoDuration.toFixed(1) || 0}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Total price is: <span className="text-lg font-semibold">{totalPrice}$</span>
                    </p>
                  </>}
                </>
              }
          </div>
        ) : (
          <>
            <Schedule
              selectedReservations={reservations}
              setReservations={(reservations) => setReservations(reservations)}
              title={changedCampaignTitle}
              setTitle={(title) => setChangedCampaignTitle(title)}
              onEditTime={null}
              canEdit={false}
              maxHeight="h-[45vh]"
            />
            <div className="m-4">
              <p>
                Your media duration in seconds: <span className="text-lg font-semibold">{videoDuration.toFixed(1) || 0}</span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Total price is: <span className="text-lg font-semibold">{totalPrice}$</span>
              </p>
              <div className="mt-2">
                <Button variant="destructive" onClick={onReject}>
                  Reject
                </Button>
                <Button variant="default" className="ml-2" onClick={onConfirm}>
                  Confirm
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSubmitModal;
