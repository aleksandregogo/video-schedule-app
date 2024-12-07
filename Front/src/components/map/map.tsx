import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './map.css';
import 'leaflet/dist/leaflet.css';
import { APIClient } from '@/services/APIClient';

interface LocationView {
  id: number;
  name: string;
  status: string;
  lat: number;
  lng: number;
  imageDownloadUrl?: string;
  price: number;
  companyId: number;
}

const MapComponent = () => {
  const [locations, setLocations] = useState<LocationView[]>([]);

  useEffect(() => {
    APIClient.get('/location/all')
      .then((response) => {
        const data = response.data.data.map((location: LocationView) => ({
          id: location.id,
          name: location.name,
          status: location.status,
          lat: location.lat,
          lng: location.lng,
          imageDownloadUrl: location.imageDownloadUrl,
          price: location.price,
          companyId: location.companyId,
        } as LocationView));

        setLocations(data);
      })
      .catch((err) => {
        console.error('Error fetching locations:', err);
      });
  }, []);

  const uploadLocationPhoto = (locationId: number) => {
    
  }

  return (
    <MapContainer
      center={{
        lat: 41.716573082982926,
        lng: 44.785917937701704
      }}
      zoom={15}
      style={{ height: '70vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{
            lat: location.lat,
            lng: location.lng
          }}
        >
          <Popup>
            <b>{location.name}</b>
            <br/>
            {location.imageDownloadUrl ?
              <img src={location.imageDownloadUrl}/>
              : <button onClick={() => uploadLocationPhoto(location.id)}>Upload photo</button>
            }
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
