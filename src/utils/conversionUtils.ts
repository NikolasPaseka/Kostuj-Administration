
export const convertDateToTimestamp = (date: Date): number => {
    return Math.floor(date.getTime()/1000);
}