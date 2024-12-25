import { ScreenStatus } from "@/types/screen.enum";
import React, { useState } from "react";

export interface ScreenCreateDto {
  name: string;
  lat: number;
  lng: number;
  price: number;
  status: ScreenStatus;
}

type ScreenFormModalProps = {
  onClose: () => void;
  onAddScreen: (screen: ScreenCreateDto) => void;
  defaultValues?: Partial<ScreenCreateDto>;
};

const ScreenFormModal: React.FC<ScreenFormModalProps> = ({
  onClose,
  onAddScreen,
  defaultValues = {},
}) => {
  const [formData, setFormData] = useState<ScreenCreateDto>({
    name: defaultValues?.name || "",
    lat: defaultValues?.lat || 0,
    lng: defaultValues?.lng || 0,
    price: defaultValues?.price || 0,
    status: defaultValues?.status || ScreenStatus.ON,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onAddScreen(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Screen</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Longitude</label>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value={ScreenStatus.ON}>{ScreenStatus.ON}</option>
              <option value={ScreenStatus.OFF}>{ScreenStatus.OFF}</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreenFormModal;
