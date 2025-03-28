import { MapLocation } from "./Domain/MapLocation";
import { MarkerData, PolygonData } from "./Domain/MapShapes";

export type MapData = {
    catalogueId: string,
    center: MapLocation,
    zoom: number,
    shapeData: (MarkerData | PolygonData)[];
}