type Props = {
  zoomIndex: number;
  zoomLevels:  {
    label: string;
    name: string;
    slotDuration: string;
  }[];
  onZoomChange: (index: number) => void;
};
  
const CalendarHeader = ({ zoomLevels, zoomIndex, onZoomChange }: Props) => {
  return (
    <div className="flex space-x-2">
      {zoomLevels.map((view, index) => (
        <button
          key={view.label}
          onClick={() => onZoomChange(index)}
          className={`px-3 py-1 text-sm rounded ${
            zoomIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default CalendarHeader;
  