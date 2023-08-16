import { Request, Response, Router } from "express";
import {CreateUserRequestModel} from "../models/CreateUserRequestModel";
import * as usersService from "../../core/users/usersService";

export const users = Router({})

users.post(
    '/', async (request: CreateUserRequestModel, response: Response) => {
        const newUser = await usersService.createUser(request.body)
        response.status(201).send(newUser);
    });