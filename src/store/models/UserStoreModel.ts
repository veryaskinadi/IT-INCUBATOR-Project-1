export type UserStoreModel = {
    id: string;
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        isConfirmed: boolean;
    };
}