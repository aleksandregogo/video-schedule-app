import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateTimeLocal } from "@/lib/utils";
import { Reservation } from "@/components/screen/types";

type EditReservationsModalProps = {
  reservations: Reservation[];
  onClose: () => void;
  onSave: (updatedReservations: Reservation[]) => void;
};

const EditReservationsModal = ({
  reservations,
  onClose,
  onSave,
}: EditReservationsModalProps) => {
  const [editedReservations, setEditedReservations] =
    useState<Reservation[]>(reservations);

  const handleInputChange = (
    id: number,
    field: keyof Reservation,
    value: string | boolean
  ) => {
    setEditedReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, [field]: value } : reservation
      )
    );
  };

  const handleSave = () => {
    // Validate for conflicts or invalid times
    const hasConflicts = editedReservations.some((reservation, _, all) => {
      const start = new Date(reservation.start).getTime();
      const end = new Date(reservation.end).getTime();
      return (
        !reservation.title.trim() ||
        start >= end ||
        all.some(
          (other) =>
            other.id !== reservation.id &&
            start < new Date(other.end).getTime() &&
            end > new Date(other.start).getTime()
        )
      );
    });

    if (hasConflicts) {
      alert("Please resolve conflicts or provide valid times.");
      return;
    }

    onSave(editedReservations);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Reservations</DialogTitle>
          <DialogDescription>
            Update reservation details and resolve any conflicts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {editedReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="border rounded-md p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={reservation.title}
                    onChange={(e) =>
                      handleInputChange(reservation.id, "title", e.target.value)
                    }
                    placeholder="Enter reservation title"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <Checkbox
                  checked={reservation.confirmed}
                  onCheckedChange={(checked) =>
                    handleInputChange(reservation.id, "confirmed", checked)
                  }
                  className="mt-6"
                >
                  Confirm
                </Checkbox>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formatDateTimeLocal(reservation.start)}
                    onChange={(e) =>
                      handleInputChange(reservation.id, "start", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Time</label>
                  <input
                    type="datetime-local"
                    value={formatDateTimeLocal(reservation.end)}
                    onChange={(e) =>
                      handleInputChange(reservation.id, "end", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationsModal;
