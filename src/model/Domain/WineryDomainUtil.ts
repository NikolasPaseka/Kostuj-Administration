import { Winery } from "../Winery";

export const WineryDomainUtil = {
    createWineryEntry: (
        wineryTitle: string, 
        email: string, 
        phoneNumber: string, 
        webAddress: string, 
        address: string, 
        adminId: string,
        id: string = "", 
        isPublic = false,
    ): Winery => {
        const winery: Winery = {
            id: id,
            name: wineryTitle,
            email: email,
            phoneNumber: phoneNumber,
            websitesUrl: webAddress,
            address: address,
            adminId: adminId,
            isPublic: isPublic
        }
        return winery;
    },

    checkWineryExists: (adminsWineries: Winery[], wineryTitle: string, address: string): boolean => {
        return adminsWineries.some(winery => 
            winery.name === wineryTitle && 
            winery.address === address
        );
    }
}