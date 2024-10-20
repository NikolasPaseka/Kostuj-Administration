import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { UserData } from "../../model/UserData";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const UserRepository = {
    getAllUsers: async (): Promise<CommunicationResult<UserData[]>> => {
        return await axiosCall(AxiosMethod.GET, `/users/`);
    },

    updateUserAuthorizations: async (userId: string, authorizations: number[]): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.PUT, `/users/${userId}/authorizations`, authorizations);
    },

    // TODO: Delete later
    resetPassword: async (userId: string, newPassword: string): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.POST, `/users/resetPassword`, {userId, newPassword});
    }
}