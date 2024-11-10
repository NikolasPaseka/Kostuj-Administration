import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

const nerServiceBaseURL = import.meta.env.VITE_NER_SERVICE_URL;

export const VoiceControlRepository = {
    sendWineRequest: async (transcript: string): Promise<CommunicationResult<unknown>> => {
        return await axiosCall(AxiosMethod.POST, "/ner", { sentence: transcript }, undefined, "application/json", nerServiceBaseURL);
    },

    sendWineryRequest: async (transcript: string): Promise<CommunicationResult<unknown>> => {
        return await axiosCall(AxiosMethod.POST, "/ner/winery", { sentence: transcript }, undefined, "application/json", nerServiceBaseURL);
    }
}