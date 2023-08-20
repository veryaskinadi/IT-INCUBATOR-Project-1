import {Request, Response, Router} from "express";
import * as postsService from "../../core/posts/postsService";
import * as blogsService from "../../core/blogs/blogsService";
import * as usersService from "../../core/users/usersService";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (request: Request, response: Response) => {
    const resultDeleteBlogs = await blogsService.deleteBlogs()
    const resultDeletePosts = await postsService.deletePosts()
    const resultDeleteUsers = await usersService.deleteUsers()

    response.sendStatus(204);
});