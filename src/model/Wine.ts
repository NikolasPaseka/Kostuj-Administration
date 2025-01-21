import { ResultSweetnessOptions } from "./Domain/ResultSweetness"
import { GrapeVarietal } from "./GrapeVarietal"
import { Winery } from "./Winery"

export interface Wine {
    id: string,
    name: string,
    color: string,
    description?: string,
    year: number,
    attribute?: string,
    residualSugar?: number,
    resultSweetness?: string,
    alcoholContent?: number,
    acidity?: number,
    grapesSweetness?: number,
    tasteResult?: string,
    productionMethod?: string,
    grapeVarietals?: GrapeVarietal[],
    imageUrl?: string,
    winaryId: Winery | string
}

export const WineUtil = {
    getResultSweetnessLabel: (wine: Wine) => {
        switch (wine.resultSweetness) {
            case ResultSweetnessOptions.DRY:
                return "Suché"
            case ResultSweetnessOptions.OFF_DRY:
                return "Polosuché"
            case ResultSweetnessOptions.SEMI_SWEET:
                return "Polosladké"
            case ResultSweetnessOptions.SWEET:
                return "Sladké"
            default:
                return ""
        }
    }
}
