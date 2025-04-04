import { Wine } from "../Wine";
import { Winery } from "../Winery";
import { WineSample } from "../WineSample";

export class WineSampleExport {
    name?: string;
    wineName: string;
    color: string;
    year: number;
    resultSweetness?: string;
    attribute?: string;
    winery: string;
    wineryAddress: string;
    rating?: number;
    champion: boolean;
    ratingCommission?: number;
    note?: string;

    constructor(wineSample: WineSample) {
        this.name = wineSample.name;
        this.wineName = (wineSample.wineId as Wine).name;
        this.color = (wineSample.wineId as Wine).color;
        this.year = (wineSample.wineId as Wine).year;
        this.winery = ((wineSample.wineId as Wine).winaryId as Winery).name;
        this.wineryAddress = ((wineSample.wineId as Wine).winaryId as Winery).address;
        this.rating = wineSample.rating;
        this.champion = wineSample.champion;
        this.ratingCommission = wineSample.ratingCommission;
        this.note = wineSample.note;
        this.resultSweetness = (wineSample.wineId as Wine).resultSweetness;
        this.attribute = (wineSample.wineId as Wine).attribute;
    }
}