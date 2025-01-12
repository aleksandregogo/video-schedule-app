import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  step: number;
  showNextStep: boolean;
  setStep: (step: number) => void;
}

const CampaignSubmitModalHeader = ({
  name,
  step,
  showNextStep,
  setStep
}: Props) => {
  return (
    <div className="h-[7vh] flex justify-between items-center bg-gray-100 p-4">
      <h2 className="text-lg font-semibold ">{name}</h2>
      <div className="flex">
        {step > 0 &&
          <Button
            onClick={() => setStep(0)}
            className="px-4 py-2 mr-2 text-white font-semibold rounded-md"
          >
            Previous
          </Button>
        }
        {step === 0 && showNextStep &&
          <Button
            onClick={() => setStep(1)}
            className="px-4 py-2 mr-2 text-white font-semibold rounded-md"
          >
            Next
          </Button> 
        }
      </div>
    </div>
  );
};

export default CampaignSubmitModalHeader;
