import { Request, Response, Router } from "express";
import * as usersService from "../../core/users/usersService";
import {AuthValidator} from "../midlewares/validation/authValidation/validator";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";

export const auth = Router({})

auth.post('/login', AuthValidator,
    async (request: Request, response: Response) => {

    const user = await usersService.checkCredentials(request.body.loginOrEmail, request.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        response.status(200).send(token);
    } else {
        response.sendStatus(401);
    }
})

auth.get('/me', authMiddleware, async (request: Request, response: Response) => {
    const user = await usersService.getUserByUserId(request.user!.id);
    if(!user){
        response.sendStatus(401);
        return
    }
    response.status(200).send(user);
})