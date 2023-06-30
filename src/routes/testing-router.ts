import {Request, Response, Router} from "express";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (request: Request, response: Response) => {
    request.body.length = 0
    response.sendStatus(204);
});