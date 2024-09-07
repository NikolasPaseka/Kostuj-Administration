import axios, { AxiosError } from "axios";
import { CommunicationError, CommunicationResult, CommunicationResultType, CommunicationSuccess } from "./CommunicationsResult";

export enum AxiosMethod{

}

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

export const axiosCall = async<T> (path: string, method: string, body?: object, accessToken?: string, contentType: string = 'application/json'): Promise<CommunicationResult<T>> => {
    try {
        const response = await axiosInstance({
            url: path,
            method: method,
            headers: {
                "Content-Type": contentType,
                authorization: "Bearer " + accessToken,
            },
            data: body
        });

        if (response.status == 200) {
            const result: CommunicationSuccess<T> = {
                type: CommunicationResultType.SUCCESS,
                data: response.data
            }
            return result;
        } else {
            const resultError: CommunicationError = {
                type: CommunicationResultType.ERROR,
                message: response.data.error,
                code: response.status
            }
            return resultError;
        }
    } catch (err: unknown) {
        console.log(err);   
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError;

            const resultError: CommunicationError = {
                type: CommunicationResultType.ERROR,
                message: axiosError.response?.statusText || "Unknown error",
                code: axiosError.response?.status || 500
            }
            return resultError;
        } else {
            const resultError: CommunicationError = {
                type: CommunicationResultType.ERROR,
                message: "Unknown error",
                code: 500
            }
            return resultError;
        }
    }
}