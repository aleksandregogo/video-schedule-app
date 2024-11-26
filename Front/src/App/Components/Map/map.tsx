import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';

const MapComponent = () => {
  useEffect(() => {
    // Initialize the map and set its view to the desired city with specific coordinates (Tbilisi)
    const map = L.map('map', {
      attributionControl: false // Disable the attribution control
    }).setView([41.716573082982926, 44.785917937701704], 15); // Coordinates set to Tbilisi

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hardcoded pins (markers) for specific locations in the city
    L.marker([41.70744054498139, 44.785720166965795]).addTo(map)
      .bindPopup('<b>ფილარმონია').openPopup();

    L.marker([41.72484218998034, 44.7800462223191]).addTo(map)
      .bindPopup('<b>სააკაძე');

    L.marker([41.716573082982926, 44.785917937701704]).addTo(map)
      .bindPopup('<b>ცირკი');

    // Cleanup function to remove the map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ height: '800px', width: '100%' }}></div>
  );
};

export default MapComponent;
