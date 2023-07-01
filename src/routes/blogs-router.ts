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
        isString: {
            errorMessage: 'Имя должно быть строкой',
        },
        trim: true,
        isLength: {
            options: {min:1, max: 15 },
            errorMessage: 'Имя должно содержать от 1 до 15 символов',
        },
    },
    description: {
        isString: {
            errorMessage: 'Описание должно быть строкой',
        },
        trim: true,
        isLength: {
            options: { max: 500 },
            errorMessage: 'Описание должно содержать не более 500 символов',
        },
    },
    websiteUrl: {
        trim: true,
        isLength: {
            options: { max: 100 },
            errorMessage: 'Адрес должен содержать не более 100 символов',
        },
        matches: {
            trim: true,
            options: (/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
        }
    },
}

// const nameValidation = body('name').isString().trim().isLength({max: 15});
// const descriptionValidation = body('description').trim().isString().isLength({max: 500});
// const websiteUrlValidation = body('websiteUrl').trim().isString().isLength({max: 100})
//     .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)


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

