export type SendRegisterEmailUserModel = {
    login: string;
    email: string;
    emailConfirmation: {
        confirmationCode: string;
    }
}