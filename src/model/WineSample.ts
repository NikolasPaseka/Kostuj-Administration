import { Wine } from "./Wine"

export type WineSample = {
    id?: string,
    name?: string,
    rating?: number,
    champion: boolean,
    catalogueId: string,
    wineId: Wine | string
}