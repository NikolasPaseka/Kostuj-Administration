import { Catalogue } from "../../model/Catalogue";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { Wine } from "../../model/Wine";
import { Winery } from "../../model/Winery";
import { WineSample } from "../../model/WineSample";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const CatalogueRepository = {
    getCataloguesByAdmin: async (): Promise<CommunicationResult<Catalogue[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/byAdmin/`);
    },

    getCatalogueDetail: async (id: string): Promise<CommunicationResult<Catalogue>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${id}`,)
    },

    deleteCatalogue: async (catalogue: Catalogue): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/${catalogue.id}`);
    },

    createCatalogue: async (catalogue: Catalogue): Promise<CommunicationResult<Catalogue>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/`, catalogue);
    },

    editCatalogue: async (catalogue: Catalogue): Promise<CommunicationResult<Catalogue>> => {
        return await axiosCall(AxiosMethod.PUT, `/catalogues/${catalogue.id}`, catalogue);
    },

    updatePublishState: async (catalogue: Catalogue, state: boolean): Promise<CommunicationResult<Catalogue>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogue.id}/publish`, { publish: state });
    },

    //Import data
    importContentData: async (catalogue: Catalogue, data: { wineries: Winery[], samples: WineSample[]}): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogue.id}/importContentData`, data);
    },

    //Participated wineries
    getParticipatedWineries: async (catalogue: Catalogue): Promise<CommunicationResult<Winery[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${catalogue.id}/wineries`);
    },

    addParticipatedWinery: async (catalogue: Catalogue, winery: Winery): Promise<CommunicationResult<Winery>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogue.id}/wineries`, winery);
    },

    removeWineryFromParticipated: async (catalogue: Catalogue, winery: Winery): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/${catalogue.id}/wineries`, winery);
    },

    //Samples
    getSamples: async (catalogueId: string): Promise<CommunicationResult<WineSample[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${catalogueId}/samples`);
    },

    createSample: async (sample: WineSample, wine?: Wine): Promise<CommunicationResult<WineSample>> => {
        return await axiosCall(AxiosMethod.POST, `/wines?createWine=${wine ? true : false}`, 
            wine ? { "wine": wine, "sample": sample }
                 : sample
        );
    },

    deleteSample: async (sample: WineSample): Promise<CommunicationResult<SuccessMessage>> => {
        console.log(sample);
        const id = sample.id ?? "";
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/samples/${id}`);
    },

    //Images
    uploadImages: async (catalogueId: string, images: File[]): Promise<CommunicationResult<string[]>> => {
        const formData = new FormData();
        images.forEach(file => {
            formData.append('catalogueImages', file);
        });
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogueId}/images`, formData, undefined, 'multipart/form-data');
    },

    deleteImage: async (catalogueId: string, imageUrl: string): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/${catalogueId}/images`, { imageUrl });
    }
}