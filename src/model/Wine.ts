import { GrapeVarietal } from "./GrapeVarietal"
import { Winery } from "./Winery"

export interface Wine {
    id: string,
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
    grapeVarietals?: GrapeVarietal[],
    imageUrl?: string,
    winaryId: Winery | string
}

export const getWineSearchName = (wine: Wine): string => {
    return `${wine.name} - ${wine.year}`;
}
