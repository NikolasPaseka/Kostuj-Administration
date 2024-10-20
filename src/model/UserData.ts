export interface UserData {
    id: string,
    email: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    accountOption: string;
    createdAt: Date;
    updatedAt: Date;
    authorizations: number[];
}