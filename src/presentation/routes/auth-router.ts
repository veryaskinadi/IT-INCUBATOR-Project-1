import { Request, Response, Router } from "express";
import * as usersService from "../../core/users/usersService";
import {AuthValidator} from "../midlewares/validation/authValidation/validator";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import  * as authService from "../../core/auth/authService";
import {registrationValidator} from "../midlewares/validation/authValidation/registrationValidator";
import { registrationConfirmationValidator } from "../midlewares/validation/authValidation/registrationConfirmationValidator";
import { registrationResendingValidator } from "../midlewares/validation/authValidation/registrationResendingValidator";
import axios from "axios";
import {settings} from "../application/settings";


export const auth = Router({})

auth.post('/login', AuthValidator,
    async (request: Request, response: Response) => {

    const user = await usersService.checkCredentials(request.body.loginOrEmail, request.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        response.status(200).send({
            accessToken: token,
        });
    } else {
        response.sendStatus(401);
    }
})

auth.get('/me', authMiddleware, async (request: Request, response: Response) => {
    const user = await usersService.getUserByUserId(request.user!.id);
    if (!user) {
        response.sendStatus(401);
        return
    }
    response.status(200).send(user);
})

auth.post('/registration', registrationValidator, async (request: Request, response: Response) => {
    const user = await usersService.getUserByEmail(request.body.email);
    if (user) {
        response.sendStatus(409);
        return
    }
    const newUser = await authService.register(request.body.email, request.body.login, request.body.password)
    response.status(204).send(newUser);
})

auth.post('/registration-confirmation', registrationConfirmationValidator, async (request: Request, response: Response) => {
    const confirmResult = await authService.confirm(request.body.code);
    if (!confirmResult) {
        response.status(400).send({errorsMessages: [{ message: "Wrong code", field: "code" }]});
        return
    }
    response.sendStatus(204);
})

auth.get('/registration-confirmation', async (request: Request, response: Response) => {
    await axios.post(`http://${settings.HOST}:${settings.PORT}/auth/registration-confirmation`, {
        code: request.query.code,
    })
    response.status(204).send();
})

auth.post('/registration-email-resending', registrationResendingValidator, async (request: Request, response: Response) => {
    const user = await usersService.getUserByEmail(request.body.email);
    if (!user) {

        response.status(400).send({ errorsMessages: [{ message: "Wrong email", field: "email" }] });

    }
    try {
        await authService.resendCode(request.body.email)
        response.status(204).send();
    } catch (error) {
        response.sendStatus(400)
    }
})
