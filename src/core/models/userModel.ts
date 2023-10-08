export type User = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string,
        isConfirmed: boolean,
    }
}