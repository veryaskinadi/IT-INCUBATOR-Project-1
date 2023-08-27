import { Request, Response, Router } from "express";
import { CreateUserRequestModel } from "../models/CreateUserRequestModel";
import * as usersService from "../../core/users/usersService";
import { createUserValidator } from "../midlewares/validation/userValidation/validator"
import {authMiddleWare} from "../midlewares/auth-middleware";


export const usersRouter = Router({})

usersRouter.post(
    '/', authMiddleWare, createUserValidator, async (request: CreateUserRequestModel, response: Response) => {
        const newUser = await usersService.createUser(request.body)
        response.status(201).send(newUser);
    }
);

usersRouter.get('/', authMiddleWare, async (request: Request, response: Response) => {
    const user = await usersService.getAllUsers({
        sortBy: request.query.sortBy ? String(request.query.sortBy) : 'createdAt',
        sortDirection: request.query.sortDirection ? String(request.query.sortDirection) : 'desc',
        pageNumber: request.query.pageNumber ? Number(request.query.pageNumber) : 1,
        pageSize: request.query.pageSize ? Number(request.query.pageSize) : 10,
        searchLoginTerm: request.query.searchLoginTerm ? String(request.query.searchLoginTerm) : null,
        searchEmailTerm: request.query.searchEmailTerm ? String(request.query.searchEmailTerm) : null,
    })
    response.status(200).send(user);
});

usersRouter.delete('/:id', authMiddleWare, async (request: Request<{id: string}>, response: Response) => {
    const user = await usersService.getUser(request.params.id)

    if (!user) {
        response.sendStatus(404);
        return;
    }

    await usersService.deleteUser(request.params.id)

    response.sendStatus(204);
});