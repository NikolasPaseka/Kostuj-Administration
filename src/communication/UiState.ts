import { Dispatch } from "react";
import { CommunicationResult, isSuccess } from "./CommunicationsResult";

export enum UiStateType {
    SUCCESS,
    LOADING,
    ERROR,
    IDLE
}

interface Success {
    type: UiStateType.SUCCESS
}

interface Loading {
    type: UiStateType.LOADING
}

interface Error {
    type: UiStateType.ERROR,
    message: string
}

interface Idle {
    type: UiStateType.IDLE
}

export type UiState = Success | Loading | Error | Idle;

// TypeGuard with type predicate as return type
export function isStateSuccess(state: UiState): state is Success {
    return state.type == UiStateType.SUCCESS;
}

export function isStateLoading(state: UiState): state is Loading {
    return state.type == UiStateType.LOADING;
}

export function isStateError(state: UiState): state is Error {
    return state.type == UiStateType.ERROR;
}

export function isStateIdle(state: UiState): state is Idle {
    return state.type == UiStateType.IDLE;
}

export const resolveUiState = <T>(
    communicationResult: CommunicationResult<T>,
    setUiState: Dispatch<UiState>,
): T | null => {
    if (isSuccess(communicationResult)) {
        setUiState({ type: UiStateType.SUCCESS });
        return communicationResult.data;
    } else {
        setUiState({ type: UiStateType.ERROR, message: communicationResult.message });
        return null;
    }
}