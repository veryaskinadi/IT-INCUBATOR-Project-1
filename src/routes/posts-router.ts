import { Request, Response, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";
import { createPostValidator } from "../midlewares/validation/postValidation/validator"
import {createPost, findPostById, findPosts, updatePost, removePostById} from "../repositories/posts-repository";


export const postsRouter = Router({});

postsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(findPosts());
});

postsRouter.post('/', authMiddleWare, createPostValidator, (request: Request, response: Response) => {
    const post = createPost(request.body, request.body.blogId);
    response.status(201).send(post)
});

postsRouter.put('/:id', authMiddleWare, createPostValidator, (request: Request, response: Response) => {
    let resultUpdate = updatePost(request.params.id, request.body)

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

