import {posts, Post} from "../store";
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
    const result = await postsCollection.insertOne({...data});
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updatePost = async (id: string, data: UpdateBlogModel) => {
    await postsCollection.updateOne({_id: new ObjId(id)}, { $set: data});
    return true;
}

export const findPostById = (id: string) => {
    const post = posts.find((post: Post) => post.id === id)
    if (post) {
        return post;
    } else {
        return false;
    }
}

export const removePostById = (id: string) => {
    let postIndex = posts.findIndex(b => b.id === id)

    if(postIndex === -1){
        return null;
    }
    posts.splice(postIndex, 1)
    return true;
}