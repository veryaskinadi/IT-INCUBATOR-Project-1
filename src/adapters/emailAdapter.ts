import nodemailer from 'nodemailer';
import { SendEmailModel } from "./SendEmailModel";

export const sendEmail = async (data: SendEmailModel): Promise<void> => {
    return new Promise((resolve) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'incubator.dilyara@gmail.com',
                pass: 'vrgm zgow pecu sric'
            }
        });

        const mailOptions = {
            to: data.to,
            subject: data.subject,
            html: data.text,
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err) throw(err)
            resolve()
        })
    })
}

