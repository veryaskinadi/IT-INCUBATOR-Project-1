import * as postsRepository from "../../store/repositories/posts-repository"
import {Post} from "../models/postModel";
import * as blogsService from "../blogs/blogsService";
import {CreatePostModel} from "../models/CreatePostModel";
import {Blog} from "../models/blogModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {GetPostsQueryModel} from "../models/GetPostsQueryModel";
import {Paginator} from "../models/Paginator";

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

export const updatePost = async (id: string, data: UpdatePostModel): Promise<void> => {
    await postsRepository.updatePost(id, data);
};

export const getPosts = async (data: GetPostsQueryModel): Promise<Paginator<Post>> => {

    const postsPaginator = await postsRepository.getPosts(data)

    const allPosts = postsPaginator.items.map( post => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blog?.name,
        createdAt: post.createdAt,
        })
    )

    return {
        pagesCount: postsPaginator.pagesCount,
        page: postsPaginator.page,
        pageSize: postsPaginator.pageSize,
        totalCount: postsPaginator.totalCount,
        items: allPosts,
    };
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