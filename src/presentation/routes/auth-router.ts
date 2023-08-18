import { Request, Response, Router } from "express";
import * as usersService from "../../core/users/usersService";

export const auth = Router({})

auth.post('/login',
    async (request: Request, response: Response) => {
    const checkResult = await usersService.checkCredentials(request.body.loginOrEmail, request.body.password)
    })