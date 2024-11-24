import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../Components/map';

const Dashboard = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/auth/user', {
        withCredentials: true,
      })
      .then((response) => {
        console.log('User Info:', response.data);
        const data = response.data.data;

        console.log(data);

        setName(data.name);
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
        navigate('/login')
      });
  }, [navigate])

  const logout = async () => {
    axios
      .get('http://localhost:5000/api/v1/auth/logout', {
        withCredentials: true,
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
      })
      .finally(() => navigate('/login'))
  }

  return <div>
    <h1>Welcome, {name}</h1>
    <button onClick={logout}>logout</button>
    <MapComponent/>
  </div>;
};

export default Dashboard;