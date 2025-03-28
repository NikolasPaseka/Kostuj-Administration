import { CalendarDate } from "@internationalized/date";
import { MapLocation } from "../model/Domain/MapLocation";
import { LatLngExpression } from "leaflet";

export const convertDateToTimestamp = (date: Date): number => {
    return Math.floor(date.getTime()/1000);
}

export const convertUnixToDateString = (unixTimestamp: number): string => {
    // Returns date in format "dd.mm.yyyy HH:MM"
    return new Date(unixTimestamp * 1000).toLocaleString(["cs-CZ"]).slice(0, -3);
}

export const convertUnixToDate = (unixTimestamp: number): Date => {
    return new Date(unixTimestamp * 1000);
}

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export const convertFromLatLngExpression = (location: LatLngExpression): MapLocation => {
    const convertedLocation = location as { lat: number, lng: number };
    return { lat: convertedLocation.lat, lng: convertedLocation.lng };
}

export const convertToLatLngExpression = (location: MapLocation): LatLngExpression => {
    return { lat: location.lat, lng: location.lng };
}