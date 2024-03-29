import {client, ObjId} from "../db";
import {CreateUserStoreModel} from "../models/CreateUserStoreModel";
import {UserStoreModel} from "../models/UserStoreModel";
import {GetUserStoreModel} from "../models/GetUserStoreModel";
import {GetUsersModel} from "../models/GetUsersModel";
import {Paginator} from "../models/Paginator";
import {Document} from "mongodb";

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
        emailConfirmation: data.emailConfirmation,
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
        id: user._id.toString(),
        emailConfirmation: user.emailConfirmation,
    };
};

export const getAllUsers = async (data: GetUsersModel): Promise<Paginator<GetUserStoreModel>> => {

    const offset = (data.pageNumber - 1) * data.pageSize;
    const sortBy = data.sortBy;

    const aggregatePipelines: Document[] = [
        { $sort: {[sortBy]: data.sortDirection === 'asc' ? 1 : -1} },
    ];

    const matchConditions = [];

    if (data.searchLoginTerm) {
        const searchLoginTerm = new RegExp(`${data.searchLoginTerm}`, 'i');
        matchConditions.push({ login: {$regex: searchLoginTerm} });
    }

    if (data.searchEmailTerm) {
        const searchEmailTerm = new RegExp(`${data.searchEmailTerm}`, 'i');
        matchConditions.push({ email: {$regex: searchEmailTerm} });
    }

    if (matchConditions.length > 0) {
        aggregatePipelines.unshift({
            $match: { $or: matchConditions }
        });
    }

    const users = await usersCollection
        .aggregate([
            ...aggregatePipelines,
            { $skip: offset },
            { $limit: data.pageSize },
        ])
        .toArray()

    const usersTotalCount = await usersCollection
        .aggregate([
            ...aggregatePipelines,
            { $count: "totalCount"},
        ])
        .toArray()

    let pagesCount = 0;
    let totalCount = 0;

    if (usersTotalCount.length > 0) {
        totalCount = usersTotalCount[0]?.totalCount;
        pagesCount = Math.ceil(totalCount / data.pageSize );
    }

    const allUsers = users.map((user:any) => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        emailConfirmation: user.emailConfirmation,
    }));

    return {
        pagesCount: pagesCount,
        page: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: totalCount,
        items: allUsers,
    }
};

export const getUserById = async (id: string): Promise<GetUserStoreModel | null>  => {
    try {
        const user = await usersCollection.findOne({_id: new ObjId(id)});
        if (!user) {
            throw new Error('Not found');
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            emailConfirmation: user.emailConfirmation,
        }
    } catch(error) {
        return null;
    }
}

export const getUserByEmail = async (email: string): Promise<GetUserStoreModel | null>  => {
    try {
        const user = await usersCollection.findOne({email});
        if (!user) {
            throw new Error('Not found');
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            emailConfirmation: user.emailConfirmation,
        }
    } catch(error) {
        return null;
    }
}

export const deleteUserById = async (id: string): Promise<void> => {
    await usersCollection.deleteOne({_id: new ObjId(id)});
}

export const deleteUsers = async () => {
    await usersCollection.deleteMany({});
    return true;
}

export const getUserByConfirmCode = async (code: string): Promise<GetUserStoreModel | null> => {
    try {
        const user = await usersCollection.findOne({
            "emailConfirmation.confirmationCode": code
        });
        if (!user) {
            throw new Error('Not found');
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            emailConfirmation: user.emailConfirmation,
        }
    } catch(error) {
        return null;
    }
}

export const confirm = async (userId: string) => {
    await usersCollection.updateOne({_id: new ObjId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}})
}

export const getUserByCredentials = async (email: string, login: string): Promise<GetUserStoreModel | null>  => {
    try {
        const user = await usersCollection.findOne({$or: [{email}, {login}]});
        if (!user) {
            throw new Error('Not found');
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            emailConfirmation: user.emailConfirmation,
        }
    } catch(error) {
        return null;
    }
}
