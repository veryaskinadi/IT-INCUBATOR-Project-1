import { SendRegisterEmailUserModel } from "../models/SendRegisterEmailUserModel";
import * as emailAdapter from "../../adapters/emailAdapter";

export const sendRegisterEmail = async (user: SendRegisterEmailUserModel): Promise<void> => {
    const text = `Код подтверждения ${user.emailConfirmation.confirmationCode}`

    await emailAdapter.sendEmail({
        to: user.email,
        subject: "Подтверждение регистрации",
        text,
    })
}