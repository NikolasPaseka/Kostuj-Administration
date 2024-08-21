import { GrapeVarietal } from "./GrapeVarietal"
import { Winery } from "./Winery"

export type Wine = {
    name: string,
    color: string,
    description?: string,
    year: number,
    residualSugar?: number,
    alcoholContent?: number,
    acidity?: number,
    grapesSweetness?: number,
    tasteResult?: string,
    productionMethod?: string,
    grapeVarietals?: [GrapeVarietal],
    imageUrl?: string,
    winaryId: Winery
}
