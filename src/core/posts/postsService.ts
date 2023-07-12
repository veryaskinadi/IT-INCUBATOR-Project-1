import * as postsRepository from "../../store/repositories/posts-repository"
import {Post} from "../models/postModel";
import * as blogsService from "../blogs/blogsService";
import {CreatePostModel} from "../models/CreatePostModel";
import {Blog} from "../models/blogModel";
import {UpdatePostModel} from "../models/UpdatePostModel";

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
};

export const updatePost = async (id: string, data: UpdatePostModel) => {
    try {
        await postsRepository.updatePost(id, data);
        return true;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
};

export const getAllPosts = async (): Promise<Post[]> => {

    const posts = await postsRepository.getAllPosts()

    const allPosts = posts.map( post => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blog?.name,
        createdAt: post.createdAt,
        })
    )

    return allPosts;
}

export const getPostById = async (id: string): Promise<Post | null> => {

    const postResult = await postsRepository.getPostById(id)
    if (!postResult) {
        return null;
    }
    const blog = await blogsService.getBlog(postResult.blogId) as Blog;

    const post = {
        ...postResult,
        blogName: blog.name,
    }
    return post;
};

export const deletePost = async (id: string): Promise<void> => {
    await postsRepository.deletePostById(id);
}

export const deletePosts = async () => {
    try {
        await postsRepository.deletePosts();
        return true;
    } catch (error) {
        return false;
    }
}