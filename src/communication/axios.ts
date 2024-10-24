import axios, { AxiosError } from "axios";
import { CommunicationError, CommunicationResult, CommunicationResultType, CommunicationSuccess } from "./CommunicationsResult";

export enum AxiosMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

type BackendError = {
    message: string;
    statusCode: number;
}

const baseURL = "http://localhost:3000/";
export const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

export const axiosCall = async<T> (
    method: string,
    path: string, 
    body: object | undefined = undefined, 
    accessToken: string | undefined = undefined, 
    contentType: string = 'application/json',
    differentBaseURL: string | undefined = undefined
): Promise<CommunicationResult<T>> => {
    if (accessToken == undefined) {
        accessToken = localStorage.getItem("accessToken") ?? undefined;
    }
    try {
        const response = await axiosInstance({
            baseURL: differentBaseURL || baseURL,
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
            const errorData = axiosError.response?.data as BackendError;

            const resultError: CommunicationError = {
                type: CommunicationResultType.ERROR,
                message: errorData.message|| "Unknown error",
                code: errorData.statusCode || 500
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