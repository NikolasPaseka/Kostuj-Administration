import { getCurrentLanguage } from "../../translations/i18n";

export enum CatalogueType {
    FEAST = "feast",
    OPEN_CELLAR = "openCellar"
}

export const getCatalogueTypeLabel = (type: CatalogueType): string => {
    const language = getCurrentLanguage();
    const labels: { [key in CatalogueType]: { [lang: string]: string } } = {
        [CatalogueType.FEAST]: {
            en: "Feast",
            cz: "Košt vín"
        },
        [CatalogueType.OPEN_CELLAR]: {
            en: "Open Cellar",
            cz: "Otevřené sklepy"
        }
    };

    return labels[type][language] || labels[type].en;
}