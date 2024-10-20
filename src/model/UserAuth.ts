export type UserAuth = {
    id: string,
    email: string,
    accessToken: string,
    refreshToken: string,
    authorizations: number[]
}