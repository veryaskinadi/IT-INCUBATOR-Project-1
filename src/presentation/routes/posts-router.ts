import { Request, Response, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";
import {createPostValidator, updatePostValidator} from "../midlewares/validation/postValidation/validator"
import * as postsService from "../../core/posts/postsService";
import {CreatePostRequestModel} from "../models/CreatePostRequestModel";
import {UpdatePostRequestModel} from "../models/UpdatePostRequestModel";

export const postsRouter = Router({});

postsRouter.get('/', async (request: Request, response: Response) => {
    const post = await postsService.getAllPosts()
    response.status(200).send(post);
});

postsRouter.post('/', authMiddleWare, createPostValidator, async (request: CreatePostRequestModel, response: Response) => {
    const newPost = await postsService.createPost(request.body)
    response.status(201).send(newPost);
});

postsRouter.put('/:id', authMiddleWare, updatePostValidator, async (request: UpdatePostRequestModel, response: Response) => {
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

postsRouter.delete('/:id', authMiddleWare, async (request: Request<{id: string}>, response: Response) => {
    const post = await postsService.getPostById(request.params.id)

    if (!post) {
        response.sendStatus(404)
        return;
    }

    await postsService.deletePost(request.params.id)

    response.sendStatus(204);

});

