import { Checkbox } from "@/components/ui/checkbox";
import { Reservation } from "../screen/types";
import { Button } from "../ui/button";
import { formatDateTimeLocal } from "@/lib/utils";
import { Input } from "../ui/input";

type Props = {
  selectedReservations: Reservation[];
  title: string;
  setTitle: (title: string) => void;
  setReservations: (reservations: Reservation[]) => void;
};

const Schedule = ({
  selectedReservations,
  title,
  setTitle,
  setReservations
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

        <div className="h-[45vh] overflow-auto">
          {selectedReservations.map(
            (slot, index) =>
              slot.canEdit && (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <div>
                    <p>
                      <strong>Start:</strong> {formatDateTimeLocal(slot.start)}
                    </p>
                    <p>
                      <strong>End:</strong> {formatDateTimeLocal(slot.end)}
                    </p>
                  </div>
                  <Checkbox
                    checked={slot.confirmed}
                    onCheckedChange={(checked) =>
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
                    }
                  />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
