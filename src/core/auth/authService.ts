import * as usersService from "../users/usersService";
import {v4 as uuidv4} from "uuid";
import * as authEmailManager from "./authEmailManager";

export const register = async (login: string, password: string): Promise<void> => {

    const data = {
        login,
        password,
        email: login,
        emailConfirmation: {
            confirmationCode: uuidv4(),
            isConfirmed: false,
        }
    }
    const newUser = await usersService.createUser(data)

    if (newUser?.emailConfirmation) {
        // отправить письмо
        authEmailManager.sendRegisterEmail(newUser)
    }


}