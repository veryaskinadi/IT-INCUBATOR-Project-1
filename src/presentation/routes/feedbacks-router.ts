import { Response, Request, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";
import * as feedbacksService from '../../core/feedbacks/feedbacksService'

export const feedbacksRouter = Router({});

feedbacksRouter.get('/:id', authMiddleWare, async (request: Request, response: Response) => {
    const feedback = await feedbacksService.getFeedbackById(request.params.id);
    if (!feedback) {
        response.sendStatus(404);
        return;
    }
    response.status(200).send(feedback);
})

feedbacksRouter.delete('/:id', authMiddleWare, async (request: Request<{id: string}>, response: Response) => {
    const feedback = await feedbacksService.getFeedbackById(request.params.id)

    if (!feedback) {
        response.sendStatus(404)
        return;
    }

    if (feedback.commentatorInfo.userId !== request.user!.id) {
        response.sendStatus(403)
        return;
    }

    await feedbacksService.deleteFeedback(request.params.id)
    response.sendStatus(204);
})









