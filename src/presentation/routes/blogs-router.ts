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
    authMiddleWare,
    createBlogValidator,
    async (request: CreateBlogRequestModel, response: Response) => {
        const newBlog = await blogsService.createBlog(request.body)
        response.status(201).send(newBlog);
    }
);

blogsRouter.put('/:id',
    authMiddleWare,
    updateBlogValidator,
    async (request: UpdateBlogRequestModel, response: Response) => {
        const blog = await blogsService.getBlog(request.params.id)

        if (!blog) {
            response.sendStatus(404);
            return;
        }

        await blogsService.updateBlog(request.params.id, request.body)

        response.sendStatus(204);
    }
);

blogsRouter.get('/:id', async (request: Request<{id: string}>, response: Response) => {
    const blog = await blogsService.getBlog(request.params.id)

    if (!blog) {
        response.sendStatus(404);
        return;
    }
    response.status(200).send(blog);

});

blogsRouter.delete('/:id', authMiddleWare, async (request: Request<{id: string}>, response: Response) => {
    const blog = await blogsService.getBlog(request.params.id)

    if (!blog) {
        response.sendStatus(404);
        return;
    }
    await blogsService.deleteBlog(request.params.id)

    response.sendStatus(204);
});

