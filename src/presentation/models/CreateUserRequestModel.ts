import {Request} from "express";

export type CreateUserRequestModel = Request<{}, {}, {
    login: string;
    password: string;
    email: string;
}>