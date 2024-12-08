import { useEffect, useState } from "react";

interface ScheduleData {
  name: string;
  uuid: string;
}

export const useScheduleData = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  return {
    scheduleData,
    setScheduleData
  };
};
