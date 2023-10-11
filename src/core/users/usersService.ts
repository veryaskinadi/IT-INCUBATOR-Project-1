import { CreateUserModel } from "../models/CreateUserModel";
import { User } from "../models/userModel";
import * as usersRepository from "../../store/repositories/users-repository";
import bcryptjs from "bcryptjs";
import { GetQueryUserModel } from "../models/GetQueryUserModel";
import { Paginator } from "../models/Paginator";
import { UserAuth } from "../../presentation/models/UserAuth";

export const createUser = async (data: CreateUserModel): Promise<User> => {

    const passwordSalt = await bcryptjs.genSaltSync(10);
    const passwordHash = await bcryptjs.hashSync(data.password, passwordSalt);

    const newData = {
        login: data.login,
        email: data.email,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: data.emailConfirmation?.confirmationCode || '0000',
            isConfirmed: typeof data.emailConfirmation?.isConfirmed === "boolean" ? data.emailConfirmation.isConfirmed : true,
        }
    }

    const newUserStore = await usersRepository.createUser(newData)
    const newUser = {
        id: newUserStore.id,
        login: newUserStore.login,
        email: newUserStore.email,
        createdAt: newUserStore.createdAt,
        emailConfirmation: newUserStore.emailConfirmation,
    }

    return newUser;
};

export const checkCredentials = async (loginOrEmail: string, password: string) => {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if(!user) return null;
    const passwordHash =  await bcryptjs.hashSync(password, user.passwordSalt);
    if(user.passwordHash !== passwordHash) {
        return null;
    }
    return user;
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

export const getUserByUserId = async (id: string): Promise<UserAuth | null> => {
    const userResult = await usersRepository.getUserById(id)
    if (!userResult) {
        return null;
    }
    const user = {
        email: userResult.email,
        login: userResult.login,
        userId: id,
    };
    return user;
}

export const getUserByEmail = async (email: string): Promise<UserAuth | null> => {
    const userResult = await usersRepository.getUserByEmail(email)
    if (!userResult) {
        return null;
    }
    const user = {
        email: userResult.email,
        login: userResult.login,
        userId: userResult.id,
    };
    return user;
}

export const confirm = async (userId: string) => {
    await usersRepository.confirm(userId);
}



