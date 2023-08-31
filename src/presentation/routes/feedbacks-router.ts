import { Response, Request, Router } from "express";
import { authMiddlewareBearer } from "../midlewares/auth-middlewareBearer";
import * as feedbacksService from '../../core/feedbacks/feedbacksService';
import { updateFeedbackValidator } from '../midlewares/validation/feedbackValidion/validator';
import { UpdateFeedbackRequestModel } from '../models/UpdateFeedbackRequestModel';

export const feedbacksRouter = Router({});

feedbacksRouter.get('/:id', async (request: Request, response: Response) => {
    const feedback = await feedbacksService.getFeedbackById(request.params.id);
    if (!feedback) {
        response.sendStatus(404);
        return;
    }
    response.status(200).send(feedback);
})

feedbacksRouter.delete('/:id', authMiddlewareBearer, async (request: Request, response: Response) => {
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

feedbacksRouter.put ('/:id', authMiddlewareBearer, updateFeedbackValidator, async (request: UpdateFeedbackRequestModel, response: Response) => {
    const feedback = await feedbacksService.getFeedbackById(request.params.id)

    if (!feedback) {
        response.sendStatus(404)
        return;
    }

    if (feedback.commentatorInfo.userId !== request.user!.id) {
        response.sendStatus(403)
        return;
    }

    await feedbacksService.updateFeedback(request.params.id, request.body.content)
    response.sendStatus(204);
})









