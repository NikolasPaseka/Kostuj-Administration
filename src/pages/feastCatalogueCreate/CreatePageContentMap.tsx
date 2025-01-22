import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L, { LatLngExpression } from "leaflet";
import { Circle, FeatureGroup, MapContainer, Marker, Polygon, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useState } from "react";
import React from "react";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer'
import PrimaryButton from "../../components/PrimaryButton";
import { MARKER_ICONS, MarkerData, PolygonData, ShapeData } from "../../model/Domain/MapShapes";

type IconName = keyof typeof MARKER_ICONS;

const CreatePageContentMap = () => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [inputLabel, setInputLabel] = useState<string>('');

  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFA500", // Orange
    "#800080", // Purple
    "#000000", // Black
  ];

  useEffect(() => {
    const savedShapes = localStorage.getItem('shapes');
    console.log("loaded data: ", savedShapes);
    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createMarkerIcon = (color: string, iconName: IconName, zoom: number) => {
    const IconComponent = MARKER_ICONS[iconName] ?? MARKER_ICONS.star
    //const baseZoom = 13;
    //const scale = Math.pow(1.5, (zoom - baseZoom));

    const svgString = `
    <svg class="size-10" fill="${color}" viewBox="0 0 24 24" style="transform: scale(${1}); transform-origin: center">
      ${IconComponent.svg}
    </svg>
  `;

  return L.divIcon({
    html: svgString,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
  };

  // const ZoomAwareMarker = ({ position, color, icon, children }) => {
  //   const map = useMap();
  //   const [zoom, setZoom] = useState(map.getZoom());
  
  //   useEffect(() => {
  //     const updateZoom = () => setZoom(map.getZoom());
  //     map.on('zoom', updateZoom);
  //     return () => {
  //       map.off('zoom', updateZoom);
  //     };
  //   }, [map]);
  
  //   return (
  //     <Marker 
  //       position={position} 
  //       icon={createMarkerIcon(color, icon as IconName, zoom)}
  //     >
  //       {children}
  //     </Marker>
  //   );
  // };

  // Function to calculate polygon center
  const calculatePolygonCenter = (positions: LatLngExpression[]): LatLngExpression => {
    const latitudes = positions.map(pos => Array.isArray(pos) ? pos[0] : (pos as { lat: number, lng: number}).lat);
    const longitudes = positions.map(pos => Array.isArray(pos) ? pos[1] : (pos as { lat: number, lng: number}).lng);
    
    const centerLat = latitudes.reduce((a, b) => a + b, 0) / positions.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / positions.length;
    
    return [centerLat, centerLng];
  };

  // Create label icon
  const createLabelIcon = (text: string) => {
    return L.divIcon({
      className: 'custom-label',
      html: `<div style="
        background-color: white;
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 14px;
        white-space: nowrap;
      ">${text}</div>`,
      iconSize: [text.length*12, 20],
      iconAnchor: [20, 10],
    });
  };

  // Handle new object creation
  const handleCreated = (e: L.DrawEvents.Created) => {
    const { layer, layerType } = e;
    
    let newShape: ShapeData;
    
    if (layerType === "marker") {
      newShape = {
        id: crypto.randomUUID(),
        type: 'marker',
        position: (layer as L.Marker).getLatLng(),
        color: selectedColor,
      } as MarkerData;
    } else if (layerType === "polygon") {
      newShape = {
        id: crypto.randomUUID(),
        type: 'polygon',
        positions: (layer as L.Polygon).getLatLngs()[0] as LatLngExpression[],
        color: selectedColor,
      } as PolygonData;
    } else {
      return; // Ignore other shape types for now
    }

    setShapes(prevShapes => [...prevShapes, newShape]);
    layer.remove(); // Remove the original shape as we'll render it through our state
  };

  const handleColorChange = (markerId: string, newColor: string) => {
    setShapes(prevShapes =>
      prevShapes.map(shape =>
        shape.id === markerId
          ? { ...shape, color: newColor }
          : shape
      )
    );
    setSelectedColor(newColor); // Update selected color for next marker
  };

  const handleLabelChange = (shapeId: string, newLabel: string) => {
    setShapes(prevShapes =>
      prevShapes.map(shape =>
        shape.id === shapeId && shape.type === 'polygon'
          ? { ...shape, label: newLabel }
          : shape
      )
    );
  };

  const handleIconChange = (shapeId: string, newIcon: keyof typeof MARKER_ICONS) => {
    setShapes(prevShapes =>
      prevShapes.map(shape =>
        shape.id === shapeId && shape.type === 'marker'
          ? { ...shape, icon: newIcon }
          : shape
      )
    );
  };

  const handleDelete = (shapeId: string) => {
    setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId));
  };

  const ColorPicker = ({ shape }: { shape: ShapeData }) => (
    <div className="p-4">
      {shape.type === 'marker' && (
        <>
        <div className="mb-2 font-bold">Select Icon</div>
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(MARKER_ICONS).map((iconName) => {
            const IconComp = MARKER_ICONS[iconName as IconName];
            return (
              <button
                key={iconName}
                className={`p-2 border rounded ${
                  (shape as MarkerData).icon === iconName ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleIconChange(shape.id, iconName as IconName)}
              >
                <IconComp.component className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </>
      )}

      <div className="mb-2 font-bold">Select Color</div>
      <div className="flex gap-2 flex-wrap mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              color === shape.color ? 'border-black' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(shape.id, color)}
          />
        ))}
      </div>
      
      {shape.type === 'polygon' && (
        <div className="mb-4">
          <div className="mb-2 font-bold">Label Text</div>
            <div className="flex gap-2">
            <input
              key={shape.id}
              autoFocus={true}
              type="text"
              value={inputLabel}
              onChange={(e) => setInputLabel(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter label text"
            />
            <button
              className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                handleLabelChange(shape.id, inputLabel);
                setInputLabel('');
              }}
            >
                OK
            </button>
            </div>
        </div>
      )}

      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => handleDelete(shape.id)}
      >
        Delete Shape
      </button>
    </div>
  );

  const logData = () => {
    shapes.forEach(shape => {
      console.log(JSON.stringify(shape));
    });
  }

  const saveData = () => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
    console.log("saved");
  }

  return (
    <>
    <PrimaryButton onClick={logData}>
      Log DATA
    </PrimaryButton>
    <PrimaryButton onClick={saveData}>
      Save DATA
    </PrimaryButton>
    <MapContainer
        center={[49.11017636702919, 16.528694936523976]}
        zoom={18}
        maxZoom={30}
        style={{ height: "80%", width: "100%", background: "grey" }}
      >
      {/* <TileLayer
       //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&style=feature:poi|visibility:off"
       //url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
       //url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
       maxNativeZoom={23}
       maxZoom={23}
       /> */}

    <ReactLeafletGoogleLayer 
      apiKey='AIzaSyCoQYww1Z6gkJhjqxjvIxHAEC7kK2r5mZE' 
      type={'roadmap'}
      maxZoom={25}
      maxNativeZoom={22}
      styles={[
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }, // Hide POIs (shops, restaurants)
        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }, // Hide transit labels
      ]}
    />

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: true,
            circle: true,
            circlemarker: false,
            polyline: true,
            polygon: true,
            marker: true,
          }}
        />
        <Circle center={[51.51, -0.06]} radius={200} />
      </FeatureGroup>

      {shapes.map((shape) => {
        if (shape.type === 'marker') {
          const marker = shape as MarkerData;
          return (
             <Marker
              key={marker.id}
              position={marker.position}
              icon={createMarkerIcon(marker.color, marker.icon ?? 'star', 18)}
            >
            {/* // <ZoomAwareMarker 
            //   position={shape.position} 
            //   color={shape.color} 
            //   icon={shape.icon ?? 'star'}
            // > */}
              <Popup>
                <ColorPicker shape={shape} />
              </Popup>
           </Marker> 
          );
        } else if (shape.type === 'polygon') {
          const polygon = shape as PolygonData;
          return (
            <React.Fragment key={shape.id}>
              <Polygon
                positions={polygon.positions}
                pathOptions={{ color: shape.color }}
              >
                <Popup className="w-[300px]">
                  <ColorPicker shape={shape} />
                </Popup>
              </Polygon>
              {polygon.label && (
                <Marker
                  position={calculatePolygonCenter(polygon.positions)}
                  icon={createLabelIcon(polygon.label)}
                  interactive={false}
                />
              )}
            </React.Fragment>
          );
        }
        return null;
      })}
    </MapContainer>
    </>
);
};

export default CreatePageContentMap