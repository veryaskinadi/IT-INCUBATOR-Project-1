import { Request, Response, Router } from "express";
import * as usersService from "../../core/users/usersService";
import {AuthValidator} from "../midlewares/validation/authValidation/validator";
import {jwtService} from "../application/jwt-service";

export const auth = Router({})

auth.post('/login', AuthValidator,
    async (request: Request, response: Response) => {

    const user = await usersService.checkCredentials(request.body.loginOrEmail, request.body.password)

    if (user) {
        const token = await jwtService.createJWT(user)
        response.status(201).send(token);
    } else {
        response.sendStatus(401);
    }
})