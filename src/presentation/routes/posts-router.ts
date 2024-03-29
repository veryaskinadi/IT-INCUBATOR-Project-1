import { Request, Response, Router } from "express";
import {
    createPostValidator,
    updatePostValidator
} from "../midlewares/validation/postValidation/validator"
import * as postsService from "../../core/posts/postsService";
import { CreatePostRequestModel } from "../models/CreatePostRequestModel";
import { UpdatePostRequestModel } from "../models/UpdatePostRequestModel";
import { authMiddlewareBearer } from "../midlewares/auth-middlewareBearer";
import { authMiddleware } from "../midlewares/auth-middleware";
import * as feedbacksService from '../../core/feedbacks/feedbacksService'
import { createFeedbackValidator } from '../midlewares/validation/feedbackValidion/validator'

export const postsRouter = Router({});

postsRouter.get('/', async (request: Request, response: Response) => {
    const post = await postsService.getPosts({
        sortBy: request.query.sortBy ? String(request.query.sortBy) : 'createdAt',
        sortDirection: request.query.sortDirection ? String(request.query.sortDirection) : 'desc',
        pageNumber: request.query.pageNumber ? Number(request.query.pageNumber) : 1,
        pageSize: request.query.pageSize ? Number(request.query.pageSize) : 10,
    })
    response.status(200).send(post);
});

postsRouter.post('/', authMiddleware, createPostValidator, async (request: CreatePostRequestModel, response: Response) => {
    const newPost = await postsService.createPost(request.body)
    response.status(201).send(newPost);
});

postsRouter.put('/:id', authMiddleware, updatePostValidator, async (request: UpdatePostRequestModel, response: Response) => {
    const post = await postsService.getPostById(request.params.id)

    if (!post) {
        response.sendStatus(404)
        return;
    }

    await postsService.updatePost(request.params.id, request.body)

    response.sendStatus(204);
});

postsRouter.get('/:id', async (request: Request<{id: string}>, response: Response) => {
    const post = await postsService.getPostById(request.params.id)

    if (!post) {
        response.sendStatus(404)
        return;
    }

    response.status(200).send(post);
});

postsRouter.delete('/:id', authMiddleware, async (request: Request<{id: string}>, response: Response) => {
    const post = await postsService.getPostById(request.params.id)

    if (!post) {
        response.sendStatus(404)
        return;
    }

    await postsService.deletePost(request.params.id)

    response.sendStatus(204);
});

postsRouter.post('/:postId/comments', authMiddlewareBearer, createFeedbackValidator,
    async (request: Request, response: Response) => {

        const post = await postsService.getPostById(request.params.postId)

        if (!post) {
            response.sendStatus(404);
            return;
        }

        const newProduct = await feedbacksService.sendFeedback({
            postId: request.params.postId,
            content: request.body.content,
            userId: request.user!.id,
        })
        response.status(201).send(newProduct)
    }
);

postsRouter.get('/:postId/comments',
    async(request: Request, response: Response) => {

    const post = await postsService.getPostById(request.params.postId)

    if (!post) {
        response.sendStatus(404);
        return;
    }

    const feedback = await feedbacksService.getAllFeedbacks({
        filter: {postId: String(request.params.postId)},
        postId: request.params.postId,
        pageNumber: request.query.pageNumber ? Number(request.query.pageNumber) : 1,
        pageSize: request.query.pageSize ? Number(request.query.pageSize) : 10,
        sortBy: request.query.sortBy ? String(request.query.sortBy) : 'createdAt',
        sortDirection: request.query.sortDirection ? String(request.query.sortDirection) : 'desc',
    })
    response.status(200).send(feedback);
});

