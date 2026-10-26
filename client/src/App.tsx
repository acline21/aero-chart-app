import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SECTIONAL_URL =
  "https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services/VFR_Sectional/MapServer/tile/{z}/{y}/{x}";

const START_CENTER: [number, number] = [41.41, -81.85];

export default function App() {
  return (
    <MapContainer
      center={START_CENTER}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TileLayer
        attribution="Charts: FAA"
        url={SECTIONAL_URL}
      />
    </MapContainer>
  );
}