import {posts} from "../store";
import {CreatePostStoreModel} from "../models/CreatePostStoreModel";
import {PostStoreModel, PostStoreModelWithBlog} from "../models/PostStoreModel";
import {client, ObjId} from "../bd";
import {UpdateBlogModel} from "../models/UpdatePostModel";

export const postsCollection = client.db().collection('posts');

export const getAllPosts = async (): Promise<PostStoreModelWithBlog[]> => {
    const posts = await postsCollection.aggregate([
        {
            $lookup: {
                from: "blogs",
                localField: "blogId",
                foreignField: "_id",
                as: "blogs"
            }
        }
    ]).toArray();

    const allPosts = posts.map(post => {
        const preparedPost: PostStoreModelWithBlog = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
            blogId: post.blogId
        }

        if (post.blogs.length > 0) {
            preparedPost.blog = {
                id: post.blogs[0]._id.toString,
                name: post.blogs[0].name,
                description: post.blogs[0].description,
                websiteUrl: post.blogs[0].websiteUrl,
                createdAt: post.blogs[0].createdAt,
            }
        }
       return preparedPost;
    });

    return allPosts;
}

export const createPost = async (data: CreatePostStoreModel): Promise<PostStoreModel> => {
    const result = await postsCollection.insertOne({
        ...data,
        blogId: new ObjId(data.blogId)
    });
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updatePost = async (id: string, data: UpdateBlogModel): Promise<void> => {
    await postsCollection.updateOne({_id: new ObjId(id)}, { $set: {
        ...data,
        blogId: new ObjId(data.blogId)
    }});
}

export const getPostById = async (id: string): Promise<PostStoreModelWithBlog | null> => {
    try {
        const post = await postsCollection.findOne({_id: new ObjId(id)});
        if (!post) {
            throw new Error('Not found');
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt: post.createdAt
        }
    } catch(error) {
        return null;
    }
}

export const deletePostById = async (id: string): Promise<void> => {
    await postsCollection.deleteOne({_id: new ObjId(id)});
}

export const deletePosts = async () => {
    await postsCollection.deleteMany({});
    return true;
}