export type GetUserStoreModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string,
        isConfirmed: boolean,
    }
}