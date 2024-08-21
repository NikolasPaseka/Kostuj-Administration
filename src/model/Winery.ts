export type Winery = {
    name: string,
    description?: string,
    phoneNumber?: string,
    email?: string,
    websitesUrl: string
    address: string,
    imageUrl?: string,
    location?: {
        latitude: number,
        longitude: number
    }
}