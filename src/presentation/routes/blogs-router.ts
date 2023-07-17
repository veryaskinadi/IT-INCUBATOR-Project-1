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
        searchNameTerm: request.query.searchNameTerm ? String(request.query.searchNameTerm) : undefined,
        sortBy: request.query.sortBy ? String(request.query.sortBy) : 'createdAt',
        sortDirection: request.query.sortDirection ? String(request.query.sortDirection) : 'desc',
        pageNumber: request.query.pageNumber ? Number(request.query.pageNumber) : 1,
        pageSize: request.query.pageSize ? Number(request.query.pageSize) : 10,
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

blogsRouter.get('/:blogId/posts', async (request: Request<{blogId: string;}, {}, {}>, response: Response) => {
    const post = await postsService.getPosts({
        filter: {blogId: String(request.params.blogId)},
        pageNumber: Number(request.query.pageNumber),
        pageSize: Number(request.query.pageSize),
        sortBy: String(request.query.sortBy),
        sortDirection: String(request.query.sortDirection),
    })
    response.status(200).send(post);
});

