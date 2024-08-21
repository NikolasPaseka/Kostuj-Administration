import { Wine } from "./Wine"

export type Sample = {
    id: string,
    name: string,
    rating?: number,
    champion: boolean,
    catalogueId: string,
    wineId: Wine
}