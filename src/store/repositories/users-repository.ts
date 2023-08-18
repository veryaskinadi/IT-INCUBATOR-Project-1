import {client, ObjId} from "../bd";
import {CreateUserStoreModel} from "../models/CreateUserStoreModel";
import {UserStoreModel} from "../models/UserStoreModel";

export const usersCollection = client.db().collection('users');

export const createUser = async (data: CreateUserStoreModel): Promise<UserStoreModel> => {

    const result = await usersCollection.insertOne(data);

    return {
        login: data.login,
        email: data.email,
        passwordHash: data.passwordHash,
        passwordSalt: data.passwordSalt,
        createdAt: data.createdAt,
        id: result.insertedId.toString(),
    };
}

export const findByLoginOrEmail = async (loginOrEmail: string): Promise<UserStoreModel | null> => {
    const user = await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }]})
    if (!user) {
        return null;
    }
    return {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        createdAt: user.createdAt,
        id: user.insertedId.toString(),
    };
}