import { Request, Response, Router } from "express";
import * as usersService from "../../core/users/usersService";
import {AuthValidator} from "../midlewares/validation/authValidation/validator";

export const auth = Router({})

auth.post('/login', AuthValidator,
    async (request: Request, response: Response) => {
    const checkResult = await usersService.checkCredentials(request.body.loginOrEmail, request.body.password)

    if (!checkResult) {
        response.sendStatus(401);
        return;
    }

    response.sendStatus(204);
})