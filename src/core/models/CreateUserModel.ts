export type CreateUserModel = {
    login: string;
    password: string;
    email: string;
    emailConfirmation?: {
        confirmationCode?: string,
        isConfirmed?: boolean,
    }
}