import { Checkbox } from "@/components/ui/checkbox"
import { Reservation, ReservationStatus } from "../screen/modals/types"
import { Button } from "../ui/button"

type Props = {
  selectedReservations: Reservation[];
  title: string;
  setTitle: (title: string) => void;
  setReservations: (reservations: Reservation[]) => void;
  handleCreate: () => void;
  onPreviousStep: () => void;
}

const Schedule = ({
    selectedReservations,
    title,
    setTitle,
    setReservations,
    handleCreate,
    onPreviousStep,
}: Props) => {
  const allConfirmed = selectedReservations.every((s) => s.confirmed);

  return (
    <div className="p-6 space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onPreviousStep}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700"
        >
          Previous
        </Button>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Campaign Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Slots Summary */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Confirm Reservations</h2>
        {selectedReservations.map((slot, index) => (
          slot.canEdit &&
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm"
          >
            <div>
              <p>
                <strong>Start:</strong> {slot.start}
              </p>
              <p>
                <strong>End:</strong> {slot.end}
              </p>
            </div>
            <Checkbox
              checked={slot.confirmed}
              onCheckedChange={(checked) => 
                setReservations(selectedReservations.map((s) =>
                    s.id === slot.id
                        ? {
                            ...s,
                            confirmed: !!checked
                        }
                : s))
              }
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={() =>
            setReservations(selectedReservations.map((s) => {
                return {
                    ...s,
                    confirmed: allConfirmed ? false : true
                }
            }))
          }
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {allConfirmed ? "Deny" : "Confirm"} All
        </Button>
        <Button
          onClick={handleCreate}
          // disabled={selectedReservations.some((s) => s.confirmed)}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Create
        </Button>
      </div>
    </div>
  )
}

export default Schedule;