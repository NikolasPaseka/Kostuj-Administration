import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { Wine } from "../../model/Wine";
import { Winery } from "../../model/Winery";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const WineryRepository = {
    getAdminsWineries: async (): Promise<CommunicationResult<Winery[]>> => {
        return await axiosCall(AxiosMethod.GET, `/wineries/byAdmin`);
    },

    getWineryWines: async (wineryId: string): Promise<CommunicationResult<Wine[]>> => {
        return await axiosCall(AxiosMethod.GET, `/wines/byWinery/${wineryId}`);
    },

    createWinery: async (winery: Winery): Promise<CommunicationResult<Winery>> => {
        return await axiosCall(AxiosMethod.POST, `/wineries`, winery);
    },

    deleteWinery: async (winery: Winery): Promise<CommunicationResult<{ numOfDeletedSamples: number, numOfDeletedWines: number}>> => {
        return await axiosCall(AxiosMethod.DELETE, `/wineries/${winery.id}`, winery);
    },

    updateWinery: async (winery: Winery): Promise<CommunicationResult<Winery>> => {
        return await axiosCall(AxiosMethod.PUT, `/wineries/${winery.id}`, winery);
    },

    importWineries: async (wineries: Winery[]): Promise<CommunicationResult<Winery[]>> => {
        return await axiosCall(AxiosMethod.POST, `/wineries/import`, wineries);
    },

    // Image
    uploadImage: async (wineryId: string, image: File): Promise<CommunicationResult<string>> => {
        const formData = new FormData();
        formData.append('wineryImage', image);
        return await axiosCall(AxiosMethod.POST, `/wineries/${wineryId}/image`, formData, undefined, 'multipart/form-data');
    },

    deleteImage: async (wineryId: string, imageUrl: string): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.DELETE, `/wineries/${wineryId}/image`, { imageUrl });
    }
}