import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Reservation } from "../screen/types";
import { Checkbox } from "../ui/checkbox";

type Props = {
  reservation: Reservation;
  duration: number;
  handleCheckboxChange: (checked: boolean) => void;
};

const ReservationCard = ({
  reservation,
  duration,
  handleCheckboxChange,
}: Props) => {
  const formattedDate = format(new Date(reservation.start), "PPPP");
  const formattedStartTime = format(new Date(reservation.start), "HH:mm:ss");
  const formattedEndTime = format(new Date(reservation.end), "HH:mm:ss");

  return (
    <Card className="flex items-center justify-between p-4 bg-white shadow-sm rounded-md">
      <CardContent>
        <CardTitle className="text-lg font-semibold text-gray-800">{formattedDate}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {formattedStartTime} - {formattedEndTime}
        </CardDescription>
        <p className="text-sm font-medium text-gray-700 mt-2">Duration: {duration} seconds</p>
      </CardContent>
      <Checkbox
        checked={reservation.confirmed}
        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
        className="ml-4"
      />
    </Card>
  );
};

export default ReservationCard;
