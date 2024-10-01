import { Wine } from "../model/Wine";
import { Winery } from "../model/Winery";
import { WineSample } from "../model/WineSample";

export class CatalogueImportUtil {
    importedData: { wineries: object[], samples: object[] }

    constructor(importedData: { wineries: object[], samples: object[] }) {
        this.importedData = importedData;
    }

    private getWineColor(color: string): string {
        switch (color.toUpperCase()) {
            case "B":
                return "white";
            case "Č":
                return "red";
            case "R":
                return "rose";
            default:
                return "red";
        }
    }

    getWineries(adminId: string): Winery[] {
        return this.importedData.wineries.map((item: object) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyItem = item as any;
            const mappedWinery: Winery = {
                id: anyItem.id || anyItem.id_vinařství || anyItem["id vinařství"], 
                name: anyItem.vinařství || anyItem.vinarstvi || anyItem.nazev,
                websitesUrl: anyItem.url || anyItem.web,
                address: anyItem.adresa || anyItem.obec,
                phoneNumber: anyItem.tel || anyItem.telefon,
                email: anyItem.email || anyItem["e-mail"],
                adminId: adminId,
                isPublic: false,
            }
            return mappedWinery;
        });
    }

    getSamples(catalogueId: string): WineSample[] {
        return this.importedData.samples.map((item: object) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyItem = item as any;
            const wine: Wine = {
                id: "",
                name: anyItem.odruda,
                winaryId: anyItem.id || anyItem.id_vinařství || anyItem["id vinařství"],
                year: anyItem.ročník || 0,
                color: this.getWineColor(anyItem.barva),
                residualSugar: anyItem.obsah_cukru,
                alcoholContent: anyItem.alkohol
            }
            const wineSample: WineSample = {
                id: "",
                name: `${anyItem.označení}`,
                rating: parseInt(anyItem.Body) ?? null,
                wineId: wine,
                catalogueId: catalogueId,
                champion: false
            }
            return wineSample;
        });
    }
}