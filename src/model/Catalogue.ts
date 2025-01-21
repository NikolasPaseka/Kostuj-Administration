import { CatalogueType } from "./Domain/CatalogueType"
import { UserData } from "./UserData"

export type Catalogue = {
    id: string,
    title: string,
    type: CatalogueType,
    description?: string,
    year: number,
    startDate: number,
    address: string,
    location: {
        latitude: number,
        longitude: number
    }
    imageUrl?: string[],
    published: boolean,
    locked: boolean,
    maxWineRating: number,
    adminId: string | UserData,
    fetchedAdmin?: UserData,
    price: number,
    downloads: number,
    participatedWineries: string[],
    coorganizators: UserData[]
    participatedWineriesCount?: number
    samplesColorCounts?: { [key: string]: number }
}