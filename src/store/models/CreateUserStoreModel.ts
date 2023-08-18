export type CreateUserStoreModel = {
    login: string;
    passwordSalt: string;
    passwordHash: string;
    email: string;
    createdAt: string;
}