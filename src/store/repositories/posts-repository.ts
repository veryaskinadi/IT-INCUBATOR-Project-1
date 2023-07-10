import {posts} from "../store";
import {CreatePostStoreModel} from "../models/CreatePostStoreModel";
import {PostStoreModel} from "../models/PostStoreModel";
import {client, ObjId} from "../bd";
import {UpdateBlogModel} from "../models/UpdatePostModel";

export const postsCollection = client.db().collection('posts');

export const getAllPosts = async (): Promise<PostStoreModel[]> => {
    const posts = await postsCollection.find({}).toArray();
    const allPosts = posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt
    }));
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

export const updatePost = async (id: string, data: UpdateBlogModel) => {
    await postsCollection.updateOne({_id: new ObjId(id)}, { $set: {
        ...data,
        blogId: new ObjId(data.blogId)
    }});
    return true;
}

export const getPostById = async (id: string): Promise<PostStoreModel | null> => {
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

export const deletePostById = async (id: string) => {
    const result = await postsCollection.deleteOne({_id: new ObjId(id)});
    return true;
}