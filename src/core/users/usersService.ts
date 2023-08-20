import {CreateUserModel} from "../models/CreateUserModel";
import {User} from "../models/userModel";
import * as usersRepository from "../../store/repositories/users-repository";
import bcryptjs from "bcryptjs";
import {GetQueryUserModel} from "../models/GetQueryUserModel";
import {Paginator} from "../models/Paginator";

export const createUser = async (data: CreateUserModel): Promise<User> => {

    const passwordSalt = await bcryptjs.genSaltSync(10);
    const passwordHash = await bcryptjs.hashSync(data.password, passwordSalt);

    const newData = {
        login: data.login,
        email: data.email,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
    }

    const newUserStore = await usersRepository.createUser(newData)
    const newUser = {
        id: newUserStore.id,
        login: newUserStore.login,
        email: newUserStore.email,
        createdAt: newUserStore.createdAt,
    }

    return newUser;
};

export const checkCredentials = async (loginOrEmail: string, password: string) => {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if(!user) return false;
    const passwordHash =  await bcryptjs.hashSync(password, user.passwordSalt);
    if(user.passwordHash !== passwordHash) {
        return false;
    }
    return true;
};

export const getAllUsers = async (data: GetQueryUserModel): Promise<Paginator<User>> => {
    const usersPaginator = await usersRepository.getAllUsers(data)
    const allUsers = usersPaginator.items.map(user => ({
            ...user,
        })
    )

    return {
        pagesCount: usersPaginator.pagesCount,
        page: usersPaginator.page,
        pageSize: usersPaginator.pageSize,
        totalCount: usersPaginator.totalCount,
        items: allUsers,
    }
};

export const getUser = async (id: string): Promise<User | null> => {
    const userResult = await usersRepository.getUserById(id)
    if (!userResult) {
        return null;
    }
    const user = {
        ...userResult,
    };
    return user;
};

export const deleteUser = async (id: string): Promise<void> => {
    await usersRepository.deleteUserById(id);
};

export const deleteUsers = async () => {
    try {
        await usersRepository.deleteUsers();
        return true;
    } catch (error) {
        return false;
    }
}


