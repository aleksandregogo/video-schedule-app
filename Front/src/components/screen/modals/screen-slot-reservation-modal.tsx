import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/utils";
import { Reservation, SelectedSlotInfo } from "./types";

type Props = {
  reservation: Reservation | null;
  onSave: (reservation: Reservation) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
};

const ReservationModal = ({ reservation, onSave, onDelete, onClose }: Props) => {
  const [title, setTitle] = useState(reservation?.title || "");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (reservation) {
      setStart(formatDateTimeLocal(reservation.start) || "");
      setEnd(formatDateTimeLocal(reservation.end) || "");
    }
  }, [reservation]);

  const handleSave = () => {
    if (!title.trim() || !start || !end) return;
    onSave({
      id: reservation?.id || null,
      title,
      start: parseDateTimeLocal(start),
      end: parseDateTimeLocal(end),
      backgroundColor: '#eab308',
      canEdit: true
    });
  };

  // Render modal using React Portals for proper layering
  return ReactDOM.createPortal(
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 rounded-lg shadow-lg bg-white z-[1050]">
        <DialogHeader>
          <DialogTitle>Reserve Time Slot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter a title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          {reservation?.id && (
            <Button
              variant="destructive"
              onClick={() => onDelete(reservation.id)}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
    document.body // Render modal outside the main modal's DOM hierarchy
  );
};

export default ReservationModal;
