export enum CommunicationResultType {
    SUCCESS,
    ERROR
}

export interface CommunicationSuccess<T> {
    type: CommunicationResultType.SUCCESS;
    data: T;
}

export interface CommunicationError {
    type: CommunicationResultType.ERROR;
    message: string;
    code: number;
}

export type CommunicationResult<T> = CommunicationSuccess<T> | CommunicationError;

// TypeGuard with type predicate as return type
export function isSuccess<T>(result: CommunicationResult<T>): result is CommunicationSuccess<T> {
    return result.type == CommunicationResultType.SUCCESS;
}

export function isError<T>(result: CommunicationResult<T>): result is CommunicationError {
    return result.type == CommunicationResultType.ERROR;
}