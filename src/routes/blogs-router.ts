import {Request, Response, Router} from "express";
import {checkSchema} from "express-validator";
import {inputValidationMadleware} from "../midlewares/input-validation-midleware";
import {authMiddleWare} from "../midlewares/auth-middleware";


type Blog = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
}

export const blogs: Blog[] = [];

const createBlogSchema = {
    name: {
        exists: {
            bail: true,
            errorMessage: 'Неверное имя',
        },
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 15 },
        },
    },
    description: {
        exists: {
            bail: true,
            errorMessage: 'Неверное описание',
        },
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 500 },
        },
    },
    websiteUrl: {
        exists: {
            bail: true,
            errorMessage: 'Неверный адрес',
        },
        trim: true,
        notEmpty: true,
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            trim: true,
            options: (/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
        }
    },
}

export const blogsRouter = Router({})

blogsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(blogs);
});

blogsRouter.post('/', checkSchema(createBlogSchema), authMiddleWare, inputValidationMadleware, (request: Request, response: Response) => {

    const newBlog = {
        id: String(+(new Date())),
        ...request.body,
    }
    blogs.push(newBlog);
    response.status(201).send(newBlog);
});

blogsRouter.put('/:id', checkSchema(createBlogSchema), authMiddleWare, inputValidationMadleware, (request: Request, response: Response) => {

    let blog = blogs.find((blog: Blog) => blog.id === request.params.id)

    if (!blog) {
        response.sendStatus(404);
        return
    }

    blog = Object.assign(blog, request.body)
    response.sendStatus(204);

});

blogsRouter.get('/:id', (request: Request, response: Response) => {
    const blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.sendStatus(404)
    }
});

blogsRouter.delete('/:id', authMiddleWare, (request: Request, response: Response) => {
    let blogIndex = blogs.findIndex(b => b.id === request.params.id)

    if(blogIndex === -1){
        response.sendStatus(404)
        return
    }

    blogs.splice(blogIndex, 1)
    response.sendStatus(204)
});

