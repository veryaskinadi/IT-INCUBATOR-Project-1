import {Request, Response, Router} from "express";
import {authMiddleWare} from "../midlewares/auth-middleware";
import {CreateBlogRequestModel} from "../models/CreateBlogRequestModel";
import * as blogsService from "../../core/blogs/blogsService";
import {createBlogValidator, updateBlogValidator} from "../midlewares/validation/blogValidation/validator";
import {UpdateBlogRequestModel} from "../models/UpdateBlogRequestModel";

export const blogsRouter = Router({})

blogsRouter.get('/', async (request: Request, response: Response) => {
    const blog = await blogsService.getAllBlogs()
    response.status(200).send(blog);
});

blogsRouter.post(
    '/',
    createBlogValidator,
    authMiddleWare,
    async (request: CreateBlogRequestModel, response: Response) => {
        const newBlog = await blogsService.createBlog(request.body)
        response.status(201).send(newBlog);
    }
);

blogsRouter.put('/:id',
    updateBlogValidator,
    authMiddleWare,
    async (request: UpdateBlogRequestModel, response: Response) => {
        const resultUpdate = await blogsService.updateBlog(request.params.id, request.body)
        if (resultUpdate) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    }
);

blogsRouter.get('/:id', async (request: Request<{id: string}>, response: Response) => {
    const blog = await blogsService.getBlog(request.params.id)
    if (blog) {
        response.status(200).send(blog);
        return;
    }
    response.sendStatus(404);
});

blogsRouter.delete('/:id', authMiddleWare, async (request: Request<{id: string}>, response: Response) => {
    const resultDelete = await blogsService.deleteBlog(request.params.id)

    if (resultDelete) {
        response.sendStatus(204);
        return;
    }

    response.sendStatus(404);
});

