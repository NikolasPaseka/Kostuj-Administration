import { Catalogue } from "../../model/Catalogue";
import { Winery } from "../../model/Winery";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const CatalogueRepository = {
    getCataloguesByAdmin: async (): Promise<CommunicationResult<Catalogue[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/byAdmin/`);
    },

    getCatalogueDetail: async (id: string): Promise<CommunicationResult<Catalogue>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${id}`,)
    },

    getParticipatedWineries: async (catalogue: Catalogue): Promise<CommunicationResult<Winery[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${catalogue.id}/wineries`);
    }
}