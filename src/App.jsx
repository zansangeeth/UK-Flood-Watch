import React, { useState, useEffect } from 'react';
import FloodMapContainer from './components/MapContainer';
import BottomDrawer from './components/BottomDrawer';


function App() {
  const [stations, setStations] = useState([]);
  const [floodZones, setFloodZones] = useState([]);
  const [showStations, setShowStations] = useState(true);
  const [showFloods, setShowFloods] = useState(true);
  const [selectedStations, setSelectedStations] = useState([]);
  const [selectedFloods, setSelectedFloods] = useState([]);

  // Fetch stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('https://environment.data.gov.uk/flood-monitoring/id/stations');
        const data = await response.json();
        const stationList = data.items || [];

        // Filter stations with valid lat/long
        const validStations = stationList
          .filter(s => s.lat && s.long && !isNaN(s.lat) && !isNaN(s.long))
          .map(s => ({
            id: s.stationReference || s['@id'],
            label: s.label,
            lat: Number(s.lat),
            long: Number(s.long),
            riverName: s.riverName,
            measures: s.measures
          }));

        setStations(validStations);
        console.log(`Loaded ${validStations.length} stations`);
      } catch (err) {
        console.error("Failed to load stations:", err);
      }
    };

    fetchStations();
  }, []);

  // Fetch flood warnings and polygons
  useEffect(() => {
    const fetchFloods = async () => {
      try {
        const response = await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods');
        const data = await response.json();
        const floods = data.items || [];

        console.log(`Fetching ${floods.length} flood warnings...`);

        const floodData = [];

        // Fetch polygons for all floods
        for (let i = 0; i < floods.length; i++) {
          const flood = floods[i];
          const polyUrl = flood.floodArea?.polygon;

          if (polyUrl) {
            try {
              const polyResponse = await fetch(polyUrl);
              const polyData = await polyResponse.json();
              const features = polyData.features || [];

              features.forEach(feature => {
                floodData.push({
                  type: "Feature",
                  properties: {
                    description: flood.description,
                    severity: flood.severity,
                    severityLevel: flood.severityLevel,
                    message: flood.message,
                    county: flood.floodArea?.county,
                    riverOrSea: flood.floodArea?.riverOrSea,
                    timeRaised: flood.timeRaised,
                    isTidal: flood.isTidal
                  },
                  geometry: feature.geometry
                });
              });
            } catch (e) {
              console.log(`Failed to fetch polygon for ${flood.description}:`, e);
            }
          }
        }

        setFloodZones(floodData);
        console.log(`✅ Loaded ${floodData.length} flood zone polygons from ${floods.length} warnings`);
      } catch (err) {
        console.error("Failed to load floods:", err);
      }
    };

    fetchFloods();
  }, []);

  // Handle polygon selection
  const handleSelection = (polygon) => {
    // Helper: Point in polygon check
    const pointInPolygon = (point, poly) => {
      const [x, y] = point;
      const coords = poly.coordinates[0];
      let inside = false;

      for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        const xi = coords[i][0], yi = coords[i][1];
        const xj = coords[j][0], yj = coords[j][1];

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }

      return inside;
    };

    // Select stations within polygon
    const stationsInPolygon = stations.filter(station =>
      pointInPolygon([station.long, station.lat], polygon)
    );

    // Select flood zones that intersect with polygon
    const floodsInPolygon = floodZones.filter(flood => {
      // Simple check: if any point of flood polygon is inside selection polygon
      const floodCoords = flood.geometry.coordinates[0];
      if (!floodCoords) return false;

      return floodCoords.some(coord => pointInPolygon(coord, polygon));
    });

    setSelectedStations(stationsInPolygon);
    setSelectedFloods(floodsInPolygon);

    console.log(`Selected: ${stationsInPolygon.length} stations, ${floodsInPolygon.length} flood zones`);
  };

  const handleClearSelection = () => {
    setSelectedStations([]);
    setSelectedFloods([]);
  };

  return (
    <div className="h-screen w-screen">
      <FloodMapContainer
        stations={stations}
        floodZones={floodZones}
        showStations={showStations}
        setShowStations={setShowStations}
        showFloods={showFloods}
        setShowFloods={setShowFloods}
        onSelect={handleSelection}
      />
      <BottomDrawer
        selectedStations={selectedStations}
        selectedFloods={selectedFloods}
        onClear={handleClearSelection}
      />
    </div>
  );
}

export default App;
