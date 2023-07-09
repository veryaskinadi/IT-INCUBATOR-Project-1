import {Request, Response, Router} from "express";
import {checkSchema} from "express-validator";
import {inputValidationMadleware} from "../midlewares/input-validation-midleware";
import {authMiddleWare} from "../midlewares/auth-middleware";
import {
    findBlogById,
    findBlogs,
    removeBlogById,
    updateBlog
} from "../../store/repositories/blogs-repository";
import {Blog} from "../../store/store";
import {CreateBlogRequestModel} from "../models/CreateBlogRequestModel";
import * as blogsService from "../../core/blogs/blogsService"


const createBlogSchema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 15 },
        },
        errorMessage: 'Неверное имя',
    },
    description: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 500 },
        },
        errorMessage: 'Неверное описание',
    },
    websiteUrl: {
        exists: true,
        trim: true,
        notEmpty: true,
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            options: (/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
        },
        errorMessage: 'Неверный адрес',
    },
}

export const blogsRouter = Router({})

blogsRouter.get('/', (request: Request, response: Response<Blog[]>) => {
    response.status(200).send(findBlogs());
});

blogsRouter.post(
    '/',
    checkSchema(createBlogSchema),
    authMiddleWare,
    inputValidationMadleware,
    async (request: CreateBlogRequestModel, response: Response) => {
        const newBlog = await blogsService.createBlog(request.body)
        response.status(201).send(newBlog);
    }
);

blogsRouter.put('/:id',
    checkSchema(createBlogSchema),
    authMiddleWare, inputValidationMadleware,
    (request: Request<{id:string}, {}, {}>, response: Response) => {
        let resultUpdate = updateBlog(request.params.id, request.body);
        if (resultUpdate) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    }
);

blogsRouter.get('/:id', (request: Request<{id: string}>, response: Response) => {
    const blog = findBlogById(request.params.id)
    if (blog) {
        response.status(200).send(blog);
        return;
    }
    response.sendStatus(404);
});

blogsRouter.delete('/:id', authMiddleWare, (request: Request<{id: string}>, response: Response) => {
    const resultDelete = removeBlogById(request.params.id)

    if (resultDelete) {
        response.sendStatus(204);
        return;
    }

    response.sendStatus(204);
});

