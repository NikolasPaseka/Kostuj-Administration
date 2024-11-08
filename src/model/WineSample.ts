import { Wine } from "./Wine"

export type WineSample = {
    id?: string,
    name?: string,
    rating?: number,
    ratingCommission?: number,
    champion: boolean,
    note?: string,
    catalogueId: string,
    wineId: Wine | string
}