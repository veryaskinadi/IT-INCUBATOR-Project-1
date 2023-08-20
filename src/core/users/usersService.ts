import {CreateUserModel} from "../models/CreateUserModel";
import {User} from "../models/userModel";
import * as usersRepository from "../../store/repositories/users-repository";
import bcryptjs from "bcryptjs";

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
    const passwordSalt = await bcryptjs.genSaltSync(10);
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if(!user) return false;
    const passwordHash =  await bcryptjs.hashSync(password, passwordSalt);
    if(user.passwordHash !== passwordHash) {
        return false;
    }
    return true;
}
