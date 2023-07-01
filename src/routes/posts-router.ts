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
//
// const titleValidation = body('title').isString().isLength({max: 30}).trim();
// const shortDescriptionValidation = body('shortDescription').isLength({max: 100}).trim();
// const contentValidation = body('content').isLength({max: 1000}).trim();
// const blogIdValidation = body('content').trim();

const createPostSchema = {
    title: {
        isString: {
            errorMessage: 'Заголовок должен быть строкой',
        },
        trim: true,
        isLength: {
            options: { max: 30 },
            errorMessage: 'Заголовок должен содержать не более 30 символов',
        },
    },
    shortDescription: {
        isString: {
            errorMessage: 'Краткое описание должно быть строкой',
        },
        trim: true,
        isLength: {
            options: { max: 100 },
            errorMessage: 'Краткое описание должно содержать не более 100 символов',
        },
    },
    content: {
        isString: {
            errorMessage: 'Контент должен быть строкой',
        },
        trim: true,
        isLength: {
            options: { max: 1000 },
            errorMessage: 'Содержимое должно содержать не более 1000 символов',
        },
    },
    blogId: {
        isString: {
            errorMessage: 'Контент должен быть строкой',
        },
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

