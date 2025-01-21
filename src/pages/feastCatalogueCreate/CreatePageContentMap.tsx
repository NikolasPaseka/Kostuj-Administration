import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L, { LatLngExpression } from "leaflet";
import { Circle, FeatureGroup, MapContainer, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState } from "react";

type Label = {
  position: LatLngExpression;
  text: string;
  id: number;
}

const CreatePageContentMap = () => {

  const [labels, setLabels] = useState<Label[]>([]);

  const labelIcon = (text: string) =>
    L.divIcon({
      className: "custom-label",
      html: `<div style="background:white;padding:5px;border-radius:5px;font-size:14px">${text}</div>`,
      iconSize: [100, 30], // Adjust width and height
      iconAnchor: [50, 15], // Adjust position
  });

  return (
    <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "80%", width: "100%", background: "grey" }}
      >
      {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      <FeatureGroup>
        <EditControl
          position='topright'
          // onEdited={this._onEditPath}
          onCreated={(e) => {
            console.log(e);
            const { layer, layerType } = e;
            if (e.layer instanceof L.Marker) {
              const labelText = prompt("Enter label text:");
              if (labelText) {
                e.layer.setIcon(labelIcon(labelText)); // Set text label
              }
            }
            if (layerType === "polygon" || layerType === "polyline") {
              layer.setStyle({
                color: "red", // Change the line color
                weight: 3,
                opacity: 1,
              });
            }
          }}
          // onDeleted={this._onDeleted}
          draw={{
            rectangle: true
          }}
        />
        <Circle center={[51.51, -0.06]} radius={200} />
      </FeatureGroup>

      <Marker position={[51.505, -0.09]}>
          <Popup>
            <button
              onClick={() => {
                const label = prompt("Enter label text:");
                if (label) {
                  setLabels((prev) => [...prev, { position: [50.505, -0.09], text: label, id: Date.now() }]);
                }
              }}
            >
              Add Label
            </button>
          </Popup>
      </Marker>

      {/* Render Labels Separately */}
      {labels.map((l) => (
        <Marker key={l.id} position={l.position} icon={L.divIcon({ className: "custom-label", html: `<div>${l.text}</div>`, iconSize: [100, 30] })} />
      ))}
      {/* {mapData && <GeoJSON data={mapData.features} />} */}
    </MapContainer>
);
}

export default CreatePageContentMap