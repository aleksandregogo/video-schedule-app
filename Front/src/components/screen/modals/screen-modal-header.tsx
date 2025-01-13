import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  step: number;
  reservationAdded: boolean;
  disableCreate: boolean;
  isEditMode: boolean;
  setStep: (step: number) => void;
  handleCreate: () => void;
}

const ScreenModalHeader = ({
  name,
  step,
  reservationAdded,
  disableCreate,
  isEditMode,
  setStep,
  handleCreate,
}: Props) => {
  return (
    <div className="h-[7vh] flex justify-between items-center bg-gray-100 p-4">
      <h2 className="text-lg font-semibold ">{name}</h2>
      <div className="flex">
        {step === 0 ? (
          <Button
            onClick={() => setStep(1)}
            disabled={!reservationAdded}
            className="px-4 py-2 text-white font-semibold rounded-md"
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setStep(0)}
              className="px-4 py-2 mr-2 text-white font-semibold rounded-md"
            >
              Previous
            </Button>
            <Button
              onClick={handleCreate}
              disabled={disableCreate}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isEditMode ? "Submit" : "Create"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ScreenModalHeader;
