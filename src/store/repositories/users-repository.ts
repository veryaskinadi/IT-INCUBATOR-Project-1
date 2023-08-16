import {client, ObjId} from "../bd";
import {CreateUserStoreModel} from "../models/CreateUserStoreModel";
import {UserStoreModel} from "../models/UserStoreModel";

export const usersCollection = client.db().collection('users');

export const createUser = async (data: CreateUserStoreModel): Promise<UserStoreModel> => {

    const result = await usersCollection.insertOne({
        ...data,
        userId: new ObjId(data.userId)
        });

    return {
        login: string,
        email: string,
        createdAt: string,
        id: result.insertedId.toString(),
    };
}