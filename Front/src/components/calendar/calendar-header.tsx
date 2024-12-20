type Props = {
    screenName: string;
    zoomIndex: number;
    onZoomChange: (index: number) => void;
  };
  
  const zoomLevels = [
    { label: "Week View" },
    { label: "Day View" },
    { label: "Hour View" },
    { label: "Minute View" },
  ];
  
  const CalendarHeader = ({ screenName, zoomIndex, onZoomChange }: Props) => {
    return (
      <div className="flex items-center justify-between px-6 pt-4 bg-gray-100 relative rounded-lg">
        {/* View Change Buttons */}
        <div className="flex space-x-2 pb-4">
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
  
        {/* Centered Title */}
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold pb-4">
          {screenName}
        </h2>
      </div>
    );
  };
  
  export default CalendarHeader;
  