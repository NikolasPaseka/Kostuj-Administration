import { Catalogue } from "../../model/Catalogue";
import { WineColor } from "../../model/Domain/WineColor";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { UserData } from "../../model/UserData";
import { Wine } from "../../model/Wine";
import { Winery } from "../../model/Winery";
import { WineSample } from "../../model/WineSample";
import { TypeChecker } from "../../utils/TypeChecker";
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
    getParticipatedWineries: async (catalogue: Catalogue | string): Promise<CommunicationResult<Winery[]>> => {
        const id = TypeChecker.isString(catalogue) ? catalogue : catalogue.id;
        return await axiosCall(AxiosMethod.GET, `/catalogues/${id}/wineries`);
    },

    addParticipatedWinery: async (catalogue: Catalogue, winery: Winery): Promise<CommunicationResult<Winery>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogue.id}/wineries`, winery);
    },

    addParticipatedWineries: async (catalogue: Catalogue, wineries: Winery[]): Promise<CommunicationResult<Winery[]>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogue.id}/wineries`, wineries);
    },

    removeWineryFromParticipated: async (catalogue: Catalogue | string, winery: Winery): Promise<CommunicationResult<SuccessMessage>> => {
        if (TypeChecker.isString(catalogue)) {
            console.log("Catalogue is string");
        } else {
            console.log("Catalogue is not string");
        }
        const id = TypeChecker.isString(catalogue) ? catalogue : catalogue.id;
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/${id}/wineries`, winery);
    },

    //Samples
    getSamples: async (catalogueId: string): Promise<CommunicationResult<WineSample[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${catalogueId}/samples`);
    },

    createSample: async (sample: WineSample, wine: Wine, selectedWineryId: string): Promise<CommunicationResult<WineSample>> => {
        return await axiosCall(AxiosMethod.POST, `/wines`, { sample, wine, selectedWineryId }
        );
    },

    deleteSample: async (sample: WineSample): Promise<CommunicationResult<SuccessMessage>> => {
        console.log(sample);
        const id = sample.id ?? "";
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/samples/${id}`);
    },

    updateSamples : async (samples: WineSample[]): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.PUT, `wines/samples`, samples);
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
    },

    // Auto functions
    autoLabelSamples: async (
        catalogueId: string, 
        prefix: string, 
        orderType: string,
        colorOrder: string[] = [],
    ): Promise<CommunicationResult<WineSample[]>> => {
        return await axiosCall(AxiosMethod.GET, `/catalogues/${catalogueId}/autoLabelSamples?prefix=${prefix}&order=${orderType}&colorOrder=${colorOrder.join(",")}`);
    },

    autoAssignCommission: async (catalogueId: string, commissionsCount: { [key in WineColor]: number }): Promise<CommunicationResult<WineSample[]>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogueId}/autoAssignCommission`, { commissionsCount });
    },


    // Coorganizators
    addCoorganizator: async (catalogueId: string, coorganizerEmail: string): Promise<CommunicationResult<UserData>> => {
        return await axiosCall(AxiosMethod.POST, `/catalogues/${catalogueId}/coorganizators`, { email: coorganizerEmail });
    },

    removeCoorganizator: async (catalogueId: string, coorganizatorId: string): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.DELETE, `/catalogues/${catalogueId}/coorganizators`, { coorganizatorId: coorganizatorId });
    }
}