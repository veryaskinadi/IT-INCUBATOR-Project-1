import {Request, Response, Router} from "express";
import {checkSchema} from "express-validator";
import {inputValidationMadleware} from "../midlewares/input-validation-midleware";
import {authMiddleWare} from "../midlewares/auth-middleware";

type Post = {
    id: "string",
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
    blogName: "string",
}

export const posts: Post[] = [];

const createPostSchema = {
    title: {
        exists: {
            bail: true,
            errorMessage: 'Неверный заголовок',
        },
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 30 },
        },

    },
    shortDescription: {
        exists: {
            bail: true,
            errorMessage: 'Неверное описание',
        },
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 100 },
        },
    },
    content: {
        exists: {
            bail: true,
            errorMessage: 'Неверный контент',
        },
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 1000 },
        },
    },
    blogId: {
        exists: {
            bail: true,
            errorMessage: 'Неверный id блога',
        },
        notEmpty: true,
        isString: true,
    },
}

export const postsRouter = Router({});

postsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(posts);
});

postsRouter.post('/', checkSchema(createPostSchema), authMiddleWare, inputValidationMadleware, (request: Request, response: Response) => {

    const newPost = {
        id: String(+(new Date())),
        blogName: "People",
        ...request.body,
    }
    posts.push(newPost);
    response.status(201).send(newPost);
});

postsRouter.put('/:id', checkSchema(createPostSchema), authMiddleWare, inputValidationMadleware, (request: Request, response: Response) => {

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

