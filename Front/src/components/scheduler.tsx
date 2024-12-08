import { APIClient } from "@/services/APIClient";
import { useState } from "react";

type SchedulerProps = {
  onCampaignCreate: (data: ScheduleData) => void;
};

export interface ScheduleData {
  name: string;
  uuid: string;
  id: number;
}

const Scheduler = ({ onCampaignCreate }: SchedulerProps) => {
  const [campaignName, setCampaignName] = useState('');
  const [screenId, setScreenId] = useState(5);

  const createCampaign = async () => {
    APIClient.post('/schedule/campaign', {
      name: campaignName,
      screenId
    })
      .then(async (response) => {
        const { uuid, name, id } = response.data;

        onCampaignCreate({ name, uuid, id })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div>
      <h2>Scheduler</h2>
      <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Yout campaign name"/>
      <input value={screenId} onChange={(e) => setScreenId(Number(e.target.value))} placeholder="Screen id"/>
      <button onClick={createCampaign} disabled={campaignName === ''}>
        Create Campaign
      </button>
    </div>
  );
};

export default Scheduler;
