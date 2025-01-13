import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Reservation } from "../screen/types";
import { Checkbox } from "../ui/checkbox";

type Props = {
  reservation: Reservation;
  handleCheckboxChange?: (checked: boolean) => void;
};

const ReservationCard = ({
  reservation,
  handleCheckboxChange,
}: Props) => {
  const startDate = new Date(reservation.start);
  const endDate = new Date(reservation.end);
  const formattedDate = format(startDate, "PPPP");
  const formattedStartTime = format(startDate, "HH:mm:ss");
  const formattedEndTime = format(new Date(reservation.end), "HH:mm:ss");
  const duration = (endDate.getTime() - startDate.getTime()) / 1000;

  return (
    <Card className="flex items-center justify-between p-4 bg-white shadow-sm rounded-md">
      <CardContent>
        <CardTitle className="text-lg font-semibold text-gray-800">{formattedDate}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {formattedStartTime} - {formattedEndTime}
        </CardDescription>
        <p className="text-sm font-medium text-gray-700 mt-2">Duration: {duration} seconds</p>
      </CardContent>
      {handleCheckboxChange && <Checkbox
        checked={reservation.confirmed}
        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
        className="ml-4"
      />}
    </Card>
  );
};

export default ReservationCard;
