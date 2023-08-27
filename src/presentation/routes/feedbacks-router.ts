import { Response, Request, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";



export const feedbacksRouter = Router({});

// feedbacksRouter.get('/', authMiddleWare, async (request: Request, response: Response) => {
//     const users = await feedbacsService.allFeedbacs();
//     response.send(users)
// })