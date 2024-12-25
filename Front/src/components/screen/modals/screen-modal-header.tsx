import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  step: number;
  reservationAdded: boolean;
  setStep: (step: number) => void;
}

const ScreenModalHeader = ({
  name,
  step,
  reservationAdded,
  setStep,
}: Props) => {
  return (
    <div className="h-[7vh] flex justify-between items-center bg-gray-100 p-4">
      <h2 className="text-lg font-semibold ">{name}</h2>
      <div className="flex">
        <Button
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="px-4 py-2 mr-2 text-white font-semibold rounded-md"
        >
          Previous
        </Button>
        <Button
          onClick={() => setStep(1)}
          disabled={step === 1 || !reservationAdded}
          className="px-4 py-2 text-white font-semibold rounded-md"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ScreenModalHeader;
