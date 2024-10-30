import { UserData } from "./UserData"

export type Catalogue = {
    id: string,
    title: string,
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
    price: number,
    downloads: number,
    participatedWineries: string[],
    participatedWineriesCount?: number
    samplesColorCounts?: { [key: string]: number }
}