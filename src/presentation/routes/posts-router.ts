import { Request, Response, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";
import {createPostValidator, updatePostValidator} from "../midlewares/validation/postValidation/validator"
import {findPostById, removePostById} from "../../store/repositories/posts-repository";
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
    const resultUpdate = await postsService.updatePost(request.params.id, request.body)
    if (resultUpdate) {
        response.sendStatus(204);
        return;
    }
    response.sendStatus(404);
});

postsRouter.get('/:id', (request: Request, response: Response) => {

    const post = findPostById(request.params.id)
    if (post) {
        response.status(200).send(post);
    } else {
        response.sendStatus(404)
    }
});

postsRouter.delete('/:id', authMiddleWare, (request: Request, response: Response) => {
    const resultDelete = removePostById(request.params.id)

    if (resultDelete) {
        response.sendStatus(204);
        return;
    }

    response.sendStatus(204);
});

