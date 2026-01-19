import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
    const [floodData, setFloodData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/flood-alerts');
                const data = await response.json();
                if (data.items) {
                    setFloodData(data.items);
                }
            } catch (error) {
                console.error('Error fetching flood data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Center of UK
    const position = [55.3781, -3.4360];

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {!loading && floodData.map((alert, index) => {
                    if (alert.eaAreaName && alert.floodArea && alert.floodArea.lat && alert.floodArea.long) {
                        return (
                            <Marker
                                key={index}
                                position={[alert.floodArea.lat, alert.floodArea.long]}
                            >
                                <Popup>
                                    <h3>{alert.description}</h3>
                                    <p><strong>Severity:</strong> {alert.severity}</p>
                                    <p><strong>Area:</strong> {alert.eaAreaName}</p>
                                    <p>{alert.message}</p>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default Map;
