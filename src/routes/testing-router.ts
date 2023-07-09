import {Request, Response, Router} from "express";
import {blogs, posts} from "../repositories/store";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (request: Request, response: Response) => {
    blogs.length = 0;
    posts.length = 0;
    response.sendStatus(204);
});