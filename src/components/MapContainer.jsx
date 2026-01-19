import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Legend from './Legend';
import { EditControl } from 'react-leaflet-draw';

// Fix for Leaflet icon imports in Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function FloodMapContainer({ stations, floodZones, showStations, setShowStations, showFloods, setShowFloods, onSelect }) {
    const [mapCenter] = useState([54.5, -2.5]); // Center of UK
    const [zoom] = useState(6);

    const _onCreated = (e) => {
        const layer = e.layer;
        const geoJSON = layer.toGeoJSON();
        onSelect(geoJSON.geometry);
    };

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <FeatureGroup>
                    <EditControl
                        position="topleft"
                        onCreated={_onCreated}
                        draw={{
                            rectangle: false,
                            polygon: true,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false
                        }}
                        edit={{
                            edit: false,
                            remove: false
                        }}
                    />
                </FeatureGroup>

                {/* Render Flood Zones */}
                {showFloods && floodZones && floodZones.map((zone, idx) => (
                    <GeoJSON
                        key={`flood-zone-${idx}`}
                        data={zone}
                        style={() => ({
                            color: zone.properties.severityLevel === 1 ? '#7f1d1d' :
                                zone.properties.severityLevel === 2 ? '#dc2626' :
                                    zone.properties.severityLevel === 3 ? '#f59e0b' : '#fbbf24',
                            fillColor: zone.properties.severityLevel === 1 ? '#7f1d1d' :
                                zone.properties.severityLevel === 2 ? '#dc2626' :
                                    zone.properties.severityLevel === 3 ? '#f59e0b' : '#fbbf24',
                            weight: 2,
                            fillOpacity: 0.3
                        })}
                    >
                        <Popup>
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{zone.properties.description}</h3>
                                <div className={`text-xs font-bold px-2 py-1 rounded inline-block text-white mb-2`}
                                    style={{
                                        backgroundColor: zone.properties.severityLevel === 1 ? '#7f1d1d' :
                                            zone.properties.severityLevel === 2 ? '#dc2626' :
                                                zone.properties.severityLevel === 3 ? '#f59e0b' : '#fbbf24'
                                    }}>
                                    {zone.properties.severity}
                                </div>

                                {zone.properties.riverOrSea && (
                                    <div className="text-xs text-gray-600 mb-1">
                                        <span className="font-medium">River/Sea:</span> {zone.properties.riverOrSea}
                                    </div>
                                )}

                                {zone.properties.county && (
                                    <div className="text-xs text-gray-600 mb-1">
                                        <span className="font-medium">County:</span> {zone.properties.county}
                                    </div>
                                )}

                                {zone.properties.isTidal !== undefined && (
                                    <div className="text-xs text-gray-600 mb-2">
                                        <span className="font-medium">Tidal:</span> {zone.properties.isTidal ? 'Yes' : 'No'}
                                    </div>
                                )}

                                <div className="text-xs text-gray-700 leading-relaxed border-t pt-2 mt-2">
                                    {zone.properties.message}
                                </div>

                                {zone.properties.timeRaised && (
                                    <div className="text-[10px] text-gray-400 mt-2">
                                        Raised: {new Date(zone.properties.timeRaised).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </GeoJSON>
                ))}

                {/* Render Monitoring Stations */}
                {showStations && stations && stations.map((station, idx) => (
                    <CircleMarker
                        key={`station-${idx}`}
                        center={[station.lat, station.long]}
                        radius={4}
                        pathOptions={{
                            color: '#3b82f6',
                            fillColor: '#3b82f6',
                            fillOpacity: 0.6,
                            weight: 1
                        }}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-gray-900 text-xs mb-1">{station.label}</h3>
                                {station.riverName && <div className="text-[10px] text-gray-600">River: {station.riverName}</div>}
                                <div className="text-[10px] text-gray-400 mt-1">{Number(station.lat).toFixed(4)}, {Number(station.long).toFixed(4)}</div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <Legend
                showStations={showStations}
                setShowStations={setShowStations}
                showFloods={showFloods}
                setShowFloods={setShowFloods}
            />
        </div>
    );
}
