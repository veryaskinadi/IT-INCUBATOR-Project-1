import * as postsRepository from "../../store/repositories/posts-repository"
import {Post} from "../models/postModel";
import * as blogsService from "../blogs/blogsService";
import {CreatePostModel} from "../models/CreatePostModel";
import {Blog} from "../models/blogModel";

export const createPost = async (data: CreatePostModel): Promise<Post> => {

    const blog = await blogsService.getBlog(data.blogId) as Blog;

    const newData = {
        ...data,
        createdAt: new Date().toISOString(),
    }
     const resultPost = await postsRepository.createPost(newData)

    const newPost = {
        ...resultPost,
        blogName: blog.name,
    }

    return newPost;
}