import { SendRegisterEmailUserModel } from "../models/SendRegisterEmailUserModel";
import * as emailAdapter from "../../adapters/emailAdapter";

//todo: поменять ручку в ссылке (<a>)
export const sendRegisterEmail = async (user: SendRegisterEmailUserModel): Promise<void> => {
    const text = `Здравствуйте, ${user.login}, для подтверждения регистрации в нашем суперском приложении перейдите по ссылке <a href="localhost:8080/auth/confirm?confirmationCode=${user.emailConfirmation.confirmationCode}">`

    await emailAdapter.sendEmail({
        to: user.email,
        subject: "Подтверждение регистрации",
        text,
    })
}