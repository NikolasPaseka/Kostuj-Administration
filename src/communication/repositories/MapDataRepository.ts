import { MapData } from "../../model/MapData";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const MapDataRepository = {
    createMapData: async (mapData: MapData) => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/mapData/${mapData.catalogueId}`, mapData);
    },

    getMapData: async (catalogueId: string): Promise<CommunicationResult<MapData>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/mapData/${catalogueId}`);
    }
}