// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};