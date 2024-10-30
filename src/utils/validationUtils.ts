export type ValidationResult = {
    isValid: boolean;
    errorMessage?: string;
}

export const validateEmailAddress = (email: string): boolean => {
    return email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? true : false;
}