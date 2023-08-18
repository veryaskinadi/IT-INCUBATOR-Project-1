import {CreateUserModel} from "../models/CreateUserModel";
import {User} from "../models/userModel";
import * as usersRepository from "../../store/repositories/users-repository"

export const createUser = async (data: CreateUserModel): Promise<User> => {

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await generateHash(password, passwordSalt);

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
    const user = usersRepository.findByLoginOrEmail(loginOrEmail);
    if(!user) return false;
    const passwordHash =  await generateHash(password, passwordSalt);
    if(user.passwordHash !== passwordHash) {
        return false;
    }
    return true;
}

const generateHash = async (password: string, salt: string) => {
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
