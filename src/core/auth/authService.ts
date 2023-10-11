import * as usersService from "../users/usersService";
import {v4 as uuidv4} from "uuid";
import * as authEmailManager from "./authEmailManager";
import {getUserByConfirmCode} from "../../store/repositories/users-repository";

export const register = async (email: string, login: string, password: string): Promise<void> => {

    const data = {
        login,
        password,
        email,
        emailConfirmation: {
            confirmationCode: uuidv4(),
            isConfirmed: false,
        }
    }
    const newUser = await usersService.createUser(data)

    if (newUser && newUser.emailConfirmation && newUser.emailConfirmation.confirmationCode) {
        authEmailManager.sendRegisterEmail(newUser)
    }
}

export const confirm = async (code: string): Promise<boolean> => {
 const user = await getUserByConfirmCode(code)
    if (user) {
        return true;
    } else {
        return false;
    }
}