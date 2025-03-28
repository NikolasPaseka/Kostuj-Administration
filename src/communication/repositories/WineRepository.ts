import { GrapeVarietal } from "../../model/GrapeVarietal";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const WineRepository = {
    getGrapeVarietals: async (): Promise<CommunicationResult<GrapeVarietal[]>> => {
        return await axiosCall(AxiosMethod.GET, `/wines/grapeVarietals`);
    },
}