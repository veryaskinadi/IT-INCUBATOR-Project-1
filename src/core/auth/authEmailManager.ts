import { SendRegisterEmailUserModel } from "../models/SendRegisterEmailUserModel";
import * as emailAdapter from "../../adapters/emailAdapter";
import {settings} from "../../presentation/application/settings";

export const sendRegisterEmail = async (user: SendRegisterEmailUserModel): Promise<void> => {
    const link = `http://${settings.HOST}:${settings.PORT}/auth/registration-confirmation?code=${user.emailConfirmation.confirmationCode}`
    const text = `<a href="${link}">${link}</a>`

    await emailAdapter.sendEmail({
        to: user.email,
        subject: "Подтверждение регистрации",
        text,
    })
}