import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Components/Map/map';
import FileUploader from '../Components/FileUploader/fileUploader';
import { APIClient } from '../../Lib/APIClient';
import Scheduler, { ScheduleData } from '../Components/Scheduler/scheduler';

const Dashboard = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    APIClient.get('/auth/user')
      .then((response) => {
        const data = response.data.data;

        setName(data.name);
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
        navigate('/login')
      });
  }, [navigate])

  const logout = async () => {
    APIClient.delete('/auth/logout')
      .catch((err) => {
        console.error('Error on log out:', err);
      })
      .finally(() => navigate('/login'))
  }

  return <div>
    <h1>Welcome, {name}</h1>
    <button onClick={logout}>logout</button>
    <Scheduler onCampaignCreate={(data) => setScheduleData(data)} />
    {scheduleData && <FileUploader scheduleData={scheduleData}/>}
    <br/><br/>
    <MapComponent/>
  </div>;
};

export default Dashboard;