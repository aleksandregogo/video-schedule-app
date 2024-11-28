import { useState } from "react";
import { APIClient } from "../../../Lib/APIClient";

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

  const createCampaign = async () => {
    APIClient.post('/schedule/campaign', {
      name: campaignName
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
      <button onClick={createCampaign} disabled={campaignName === ''}>
        Create Campaign
      </button>
    </div>
  );
};

export default Scheduler;
