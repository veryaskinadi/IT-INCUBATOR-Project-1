import { Request, Response, Router } from "express";
import { authMiddleWare } from "../midlewares/auth-middleware";
import { blogs, Blog } from "./blogs-router";
import { createPostValidator } from "../midlewares/validation/createPostValidation/validator"

type Post = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

export const posts: Post[] = [];

export const postsRouter = Router({});

postsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(posts);
});

postsRouter.post('/', authMiddleWare, createPostValidator, (request: Request, response: Response) => {

    let blog = blogs.find((blog: Blog) => blog.id === request.body.blogId)
    if (!blog) {
        response.sendStatus(404);
        return
    }
    const newPost = {
        id: String(+(new Date())),
        blogName: blog.name,
        ...request.body,
    }
    posts.push(newPost);
    response.status(201).send(newPost);
});

postsRouter.put('/:id', authMiddleWare, createPostValidator, (request: Request, response: Response) => {

    let post = posts.find((post: Post) => post.id === request.params.id)

    if (!post) {
        response.sendStatus(404);
        return
    }

    post = Object.assign(post, request.body)
    response.sendStatus(204);
});

postsRouter.get('/:id', (request: Request, response: Response) => {
    const post = posts.find((post: Post) => post.id === request.params.id)
    if (post) {
        response.status(200).send(post);
    } else {
        response.sendStatus(404)
    }
});

postsRouter.delete('/:id', authMiddleWare, (request: Request, response: Response) => {
    let postIndex = posts.findIndex(b => b.id === request.params.id)

    if(postIndex === -1){
        response.sendStatus(404)
        return
    }
    posts.splice(postIndex, 1)
    response.sendStatus(204)
});

