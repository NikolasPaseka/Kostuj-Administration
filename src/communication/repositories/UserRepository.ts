import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { UserAdministrationSettings } from "../../model/UserAdministrationSettings";
import { UserAuth } from "../../model/UserAuth";
import { UserData } from "../../model/UserData";
import { axiosCall, AxiosMethod } from "../axios";
import { CommunicationResult } from "../CommunicationsResult";

export const UserRepository = {
    // Auth
    login: async (email: string, password: string): Promise<CommunicationResult<UserAuth>> => {
        return await axiosCall(AxiosMethod.POST, `/users/login`, { email, password });
    },

    register: async (email: string, password: string, firstName: string, lastName: string): Promise<CommunicationResult<UserAuth>> => {
        return await axiosCall(AxiosMethod.POST, `/users/register`, { email, password, firstName, lastName });
    },

    getAllUsers: async (): Promise<CommunicationResult<UserData[]>> => {
        return await axiosCall(AxiosMethod.GET, `/users/`);
    },

    getUserById: async (userId: string): Promise<CommunicationResult<UserAuth>> => {
        return await axiosCall(AxiosMethod.GET, `/users/${userId}`);
    },

    getUserDataById: async (userId: string): Promise<CommunicationResult<UserData>> => {
        return await axiosCall(AxiosMethod.GET, `/users/${userId}`);
    },

    updateUserAuthorizations: async (userId: string, authorizations: number[]): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.PUT, `/users/${userId}/authorizations`, authorizations);
    },

    // TODO: Delete later
    resetPassword: async (userId: string, newPassword: string): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.POST, `/users/resetPassword`, {userId, newPassword});
    },

    // Administration settings
    getAdministrationSettings: async (): Promise<CommunicationResult<UserAdministrationSettings>> => {
        return await axiosCall(AxiosMethod.GET, `/users/administrationSettings`);
    },

    updateAdministrationSettings: async (settings: UserAdministrationSettings): Promise<CommunicationResult<SuccessMessage>> => {
        return await axiosCall(AxiosMethod.PUT, `/users/administrationSettings`, settings);
    },
}