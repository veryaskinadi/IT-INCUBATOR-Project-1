import {CreateUserModel} from "../models/CreateUserModel";
import {User} from "../models/userModel";
import * as usersRepository from "../../store/repositories/users-repository"

export const createUser = async (data: CreateUserModel): Promise<User> => {

    const newData = {
        ...data,
        createdAt: new Date().toISOString(),
    }

    const newUser = await usersRepository.createUser(newData)

    return newUser;
};