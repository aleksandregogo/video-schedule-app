import { Checkbox } from "@/components/ui/checkbox";
import { Reservation } from "../screen/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ReservationCard from "./reservationCard";

type Props = {
  selectedReservations: Reservation[];
  title: string;
  maxHeight: string;
  setTitle: (title: string) => void;
  setReservations: (reservations: Reservation[]) => void;
  onEditTime?: () => void;
};

const Schedule = ({
  selectedReservations,
  title,
  maxHeight = 'h-[45vh]',
  setTitle,
  setReservations,
  onEditTime
}: Props) => {
  const allConfirmed = selectedReservations.every((s) => s.confirmed);

  const handleToggleAll = (checked: boolean) => {
    setReservations(
      selectedReservations.map((s) => ({
        ...s,
        confirmed: checked,
      }))
    );
  };

  return (
    <div className="p-6 space-y-4 mt-4">
      {/* Title Input */}
      {onEditTime && <Button
        onClick={onEditTime}
        // className="m-4"
      >
        Edit on time table
      </Button>}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Campaign Title
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          className="mt-1"
        />
      </div>

      {/* Slots Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Confirm Reservations</h2>
          {/* Checkbox to Confirm/Deny All */}
          <div
            className="flex items-center space-x-2 p-4 cursor-pointer"
            onClick={() => handleToggleAll(!allConfirmed)}
          >
            <span>{allConfirmed ? "Deselect All" : "Select All"}</span>
            <Checkbox
              checked={allConfirmed}
            />
          </div>
        </div>

        <div className={`${maxHeight} overflow-auto`}>
          {selectedReservations.map(
            (slot, index) =>
              slot.canEdit && (
                <ReservationCard
                  key={index}
                  reservation={slot}
                  duration={30}
                  handleCheckboxChange={(checked) => {
                    setReservations(
                      selectedReservations.map((s) =>
                        s.id === slot.id
                          ? {
                              ...s,
                              confirmed: !!checked,
                            }
                          : s
                      )
                    )
                  }}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
