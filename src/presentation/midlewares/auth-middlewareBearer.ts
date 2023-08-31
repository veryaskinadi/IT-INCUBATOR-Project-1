import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import * as usersService from "../../core/users/usersService"

export const authMiddlewareBearer = async (request: Request, response: Response, next: NextFunction) => {
    if (!request.headers.authorization){
        response.sendStatus(401)
        return
    }

    const token = request.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        request.user = await usersService.getUser(userId)
        if (!request.user) {
            response.sendStatus(401)
            return
        }
    } else {
        response.sendStatus(401)
        return
    }
    next()
}
