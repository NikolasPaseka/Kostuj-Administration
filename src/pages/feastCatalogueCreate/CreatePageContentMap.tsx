import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L, { LatLngExpression } from "leaflet";
import { FeatureGroup, MapContainer, Marker, Polygon, Popup, Tooltip, useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import React from "react";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer'
import PrimaryButton from "../../components/PrimaryButton";
import { MARKER_ICONS, MarkerData, PolygonData, ShapeData } from "../../model/Domain/MapShapes";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { Catalogue } from "../../model/Catalogue";
import { Winery } from "../../model/Winery";
import { isSuccess } from "../../communication/CommunicationsResult";
import SelectionField from "../../components/Controls/SelectionField";
import { CircularProgress } from "@heroui/react";
import { MapDataRepository } from "../../communication/repositories/MapDataRepository";
import { MapData } from "../../model/MapData";
import { convertFromLatLngExpression } from "../../utils/conversionUtils";
import GenericInput from "../../components/GenericInput";
import { CheckIcon } from "@heroicons/react/24/solid";

type IconName = keyof typeof MARKER_ICONS;

const CreatePageContentMap = ({ catalogue }: { catalogue: Catalogue}) => {
  const [isMapDataLoading, setIsMapDataLoading] = useState<boolean>(true);
  
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [selectedIcon, setSelectedIcon] = useState<IconName>('default');
  const [inputLabel, setInputLabel] = useState<string>('');
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  // Map states
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([49.11017636702919, 16.528694936523976]);

  const selectedIconRef = useRef(selectedIcon);
  const editControlRef = useRef(null);

  useEffect(() => {
    selectedIconRef.current = selectedIcon;
  }, [selectedIcon]);

  const MapEvents = () => {
    const map = useMapEvents({
        zoomend: () => {
            setMapZoom(map.getZoom());
        },
        moveend: () => {
          setMapCenter(map.getCenter());
      },
    });
    return null;
  };

  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFA500", // Orange
    "#800080", // Purple
    "#000000", // Black
  ];

  useEffect(() => {
    const fetchParticipatedWineries = async () => {
      const res = await CatalogueRepository.getParticipatedWineries(catalogue);
      if (isSuccess(res)) { setParticipatedWineries(res.data); } 
    };

    const fetchMapData = async () => {
      const res = await MapDataRepository.getMapData(catalogue.id);
      if (isSuccess(res)) {
        const mapData = res.data;
        setMapZoom(mapData.zoom);
        setMapCenter(convertFromLatLngExpression(mapData.center));
        setShapes(mapData.shapeData);
        setIsMapDataLoading(false);
      }
    }

    fetchParticipatedWineries();
    fetchMapData();
    
  }, [catalogue]);

  const createMarkerIcon = (color: string, iconName: IconName) => {
    const IconComponent = MARKER_ICONS[iconName] ?? MARKER_ICONS.default;

    return L.divIcon({
      //html: svgString,
      html: `
        <div>
          <svg class="size-10" fill="${color}" viewBox="0 0 24 24" style="transform: scale(${1}); transform-origin: center">
            ${IconComponent.svg}
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [48, 48],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

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

  const ZoomDependentLabel = ({ shape }: { shape: ShapeData }) => {
    return (
      <>
        {shape.type == 'marker' && (shape as MarkerData).selectedWineryId && mapZoom > 16 && (
          <Marker
            position={(shape as MarkerData).position}
            icon={createLabelIcon(participatedWineries.find(winery => winery.id === (shape as MarkerData).selectedWineryId)?.name ?? '')}
            interactive={false}
          />
        )}
        {shape.type == 'polygon' && (shape as PolygonData).label && mapZoom > 16 && ( 
          <Marker
            position={calculatePolygonCenter((shape as PolygonData).positions)}
            icon={createLabelIcon((shape as PolygonData).label ?? '')}
            interactive={false}
          />
        )}
      </>
    );
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
        icon: selectedIconRef.current,
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
  }

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
        shape.id === shapeId
          ? { ...shape, label: newLabel }
          : shape
      )
    );
  };

  const handleIconChange = (shapeId: string, newIcon: keyof typeof MARKER_ICONS) => {
    setShapes(prevShapes =>
      prevShapes.map(shape =>
        shape.id === shapeId && shape.type === 'marker'
          ? { ...shape, icon: newIcon, selectedWineryId: undefined }
          : shape
      )
    );
  };

  const handleDelete = (shapeId: string) => {
    setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId));
  };

  const ColorPicker = ({ shape }: { shape: ShapeData }) => (
    <div className="p-4 w-[300px]">
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
                <div className="w-10 h-10">
                  <IconComp.component />
                </div>
              </button>
            );
          })}
        </div>
        {shape.type === 'marker' && (shape as MarkerData).icon as IconName == 'winery' && (
          <SelectionField
            label="Select Winery"
            defaultSelectedKeys={[]}
            selectedKeys={[(shape as MarkerData).selectedWineryId ?? '']}
            items={participatedWineries.map(winery => ({ value: winery.id, label: winery.name }))}
            onSelectionChange={(e) => {
              const selectedWineryId = e.target.value;
              setShapes(prevShapes => prevShapes.map(
                s => s.id === shape.id 
                  ? { ...s, selectedWineryId } 
                  : s
              ));
            }}
          />
        )}
      </>
      )}
    
      { (shape.type === 'polygon' || (shape.type === 'marker' && (shape as MarkerData).icon as IconName == 'default')) && (
        <>
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
        </>
      )
      }
      
      {(shape.type === 'polygon' || (shape.type === 'marker' && (shape as MarkerData).icon == 'default')) && (
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

  const saveData = () => {
    const mapData: MapData = {
      catalogueId: catalogue.id,
      zoom: mapZoom,
      center: convertFromLatLngExpression(mapCenter),
      shapeData: shapes as (MarkerData | PolygonData)[]
    }

    MapDataRepository.createMapData(mapData);
  }

  const startDrawingMarker = () => {
    console.log(editControlRef.current);
    if (editControlRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drawControl = editControlRef.current as any;
      drawControl._toolbars.draw._modes.marker.handler.enable();
    }
  };

  return (
    <>
    {isMapDataLoading && (
      <CircularProgress />
    )}
    <div className="flex items-center">
      <GenericInput 
        value="Hlina"
        onChange={() => {}}
        className="w-[20%] pr-4"
        label="City name"
        labelPlacement="inside"
      />
      <div className="flex gap-3 flex-wrap mb-4 flex-1">
        {Object.keys(MARKER_ICONS).map((iconName) => {
          const IconComp = MARKER_ICONS[iconName as IconName];
          return (
            <div className="flex flex-col items-center">
              <p className="text-xs">{iconName.toUpperCase()}</p>
              <button
                key={iconName}
                className={`p-1 border rounded ${
                  selectedIcon === iconName ? 'border-secondary' : 'border-gray-300'
                }`}
                onClick={() => { 
                  setSelectedIcon(iconName as IconName)
                  startDrawingMarker();
                }} 
              >
                <div className="w-8 h-8">
                  <IconComp.component />
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <PrimaryButton 
        onClick={saveData} 
        EndContent={CheckIcon}
      >
        Save
      </PrimaryButton>
    </div>
    {!isMapDataLoading && (
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          maxZoom={30}
          style={{ height: "80%", width: "100%", background: "grey" }}
          className="rounded-md"
        >
        {/* <TileLayer
         //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&style=feature:poi|visibility:off"
         //url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
         //url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
         maxNativeZoom={23}
         maxZoom={23}
         /> */}
          <MapEvents />
          <ReactLeafletGoogleLayer 
            apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY} 
            type={'roadmap'}
            maxZoom={25}
            maxNativeZoom={22}
            styles={[
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
            ]}
          />

          <FeatureGroup>
            <EditControl
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onMounted={(control: any) => {
                editControlRef.current = control;
               }}
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polyline: true,
                polygon: true,
                marker: true,
              }}
              edit={{
                remove: false,
                edit: false
              }}
            />
          </FeatureGroup>
  
        {shapes.map((shape) => {
          if (shape.type === 'marker') {
            const marker = shape as MarkerData;
            return (
              <>
              <Marker
                key={marker.id}
                position={marker.position}
                icon={createMarkerIcon(marker.color, marker.icon ?? 'default')}
              >
                <Popup>
                  <ColorPicker shape={shape} />
                </Popup>
                {(marker.selectedWineryId) && mapZoom > 16 && (
                  <Tooltip direction='top' offset={[0, -40]} opacity={1} permanent>
                    <span>{participatedWineries.find(w => w.id == marker.selectedWineryId)?.name}</span>
                  </Tooltip>
                )}
                {marker.label && mapZoom > 16 && (
                  <Tooltip direction='top' offset={[0, -40]} opacity={1} permanent>
                    <span>{marker.label}</span>
                  </Tooltip>
                )}
             </Marker> 
             </>
            );
          } else if (shape.type === 'polygon') {
            const polygon = shape as PolygonData;
            return (
              <React.Fragment key={shape.id}>
                <Polygon
                  positions={polygon.positions} 
                  pathOptions={{ color: shape.color }}
                >
                  <Popup>
                    <ColorPicker shape={shape} />
                  </Popup>
                </Polygon>
                {polygon.label && (
                  <ZoomDependentLabel shape={polygon} />
                )}
              </React.Fragment>
            );
          }
          return null;
        })}
      </MapContainer>
    )}
    </>
);
};

export default CreatePageContentMap