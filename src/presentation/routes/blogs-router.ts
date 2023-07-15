import {Request, Response, Router} from "express";
import {authMiddleWare} from "../midlewares/auth-middleware";
import {CreateBlogRequestModel} from "../models/CreateBlogRequestModel";
import * as blogsService from "../../core/blogs/blogsService";
import {createBlogValidator, updateBlogValidator} from "../midlewares/validation/blogValidation/validator";
import {UpdateBlogRequestModel} from "../models/UpdateBlogRequestModel";
import {createPostByIdValidator} from "../midlewares/validation/postValidation/validator";
import {CreatePostByBlogIdRequestModel} from "../models/CreatePostByBlogIdRequestModel";
import * as postsService from "../../core/posts/postsService";

export const blogsRouter = Router({})

blogsRouter.get('/', async (request: Request, response: Response) => {
    const blog = await blogsService.getAllBlogs({
        searchNameTerm: String(request.query.searchNameTerm),
        sortBy: String(request.query.sortBy),
        sortDirection: String(request.query.sortDirection),
        pageNumber: Number(request.query.pageNumber),
        pageSize: Number(request.query.pageSize),
    })
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

blogsRouter.post('/:blogId/posts', authMiddleWare, createPostByIdValidator, async (request: CreatePostByBlogIdRequestModel, response: Response) => {

    const createPostData = {
        blogId: request.params.blogId,
        ...request.body,
    }

    const newPost = await postsService.createPost(createPostData)
    response.status(201).send(newPost);
});

