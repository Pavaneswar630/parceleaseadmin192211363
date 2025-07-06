import React, { useState } from "react";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface AddressCoord {
  address: string;
  lat: number;
  lon: number;
}

export default function RouteOptimizer() {
  const [addresses, setAddresses] = useState<AddressCoord[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [column, setColumn] = useState("");
  const [rawData, setRawData] = useState<any[]>([]);
  const [fileLoaded, setFileLoaded] = useState(false);

  const geocodeAddress = async (address: string): Promise<AddressCoord | null> => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return {
        address,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  const haversine = (c1: AddressCoord, c2: AddressCoord): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(c2.lat - c1.lat);
    const dLon = toRad(c2.lon - c1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const optimizeRoute = (coords: AddressCoord[]): number[] => {
    let path = coords.slice(1).map((_, i) => i + 1); // start from index 1
    let improved = true;

    const totalDistance = (route: number[]) => {
      let dist = haversine(coords[0], coords[route[0]]);
      for (let i = 0; i < route.length - 1; i++) {
        dist += haversine(coords[route[i]], coords[route[i + 1]]);
      }
      return dist;
    };

    while (improved) {
      improved = false;
      for (let i = 1; i < path.length - 1; i++) {
        for (let j = i + 1; j < path.length; j++) {
          const newPath = [...path];
          newPath.splice(i, j - i + 1, ...path.slice(i, j + 1).reverse());
          if (totalDistance(newPath) < totalDistance(path)) {
            path = newPath;
            improved = true;
          }
        }
      }
    }

    return path;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        setRawData(results.data);
        setFileLoaded(true);
      },
    });
  };

  const handleOptimize = async () => {
    if (!column.trim()) return;
    setLoading(true);

    const addressesOnly: string[] = rawData.map((row: any) => row[column]).filter((x: string) => !!x);
    const geocoded: AddressCoord[] = [];

    const chennai = await geocodeAddress("Chennai, India");
    if (chennai) geocoded.push(chennai);

    for (const addr of addressesOnly) {
      const loc = await geocodeAddress(addr);
      if (loc) geocoded.push(loc);
    }

    setAddresses(geocoded);
    const optimized = optimizeRoute(geocoded);
    setRoute(optimized);
    setLoading(false);
  };

  const renderMap = () => {
    if (addresses.length === 0 || route.length === 0) return null;
    const start = addresses[0];
    const path = [0, ...route].map((i) => [addresses[i].lat, addresses[i].lon] as [number, number]);

    return (
      <MapContainer center={[start.lat, start.lon]} zoom={10} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {path.map(([lat, lon], i) => (
          <Marker
            key={i}
            position={[lat, lon]}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              Stop {i + 1}: {addresses[[0, ...route][i]].address}
            </Popup>
          </Marker>
        ))}
        <Polyline positions={path} color="blue" />
      </MapContainer>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h2 className="text-xl font-semibold">Route Optimizer</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border p-2 rounded w-full"
        />
        {fileLoaded && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter address column name (e.g., Pickup Location)"
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleOptimize}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Optimize Route
            </button>
          </div>
        )}
        {loading && <p>Processing... Please wait.</p>}
        {!loading && renderMap()}
      </div>
    </div>
  );
}
