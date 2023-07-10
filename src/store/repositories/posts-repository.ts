import {posts, Post} from "../store";
import {CreatePostStoreModel} from "../models/CreatePostStoreModel";
import {PostStoreModel} from "../models/PostStoreModel";
import {client} from "../bd";

export const postsCollection = client.db().collection('posts');

export const findPosts = () => {return posts}

export const createPost = async (data: CreatePostStoreModel): Promise<PostStoreModel> => {
    const result = await postsCollection.insertOne({...data});
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updatePost = (id: string, data: any) => {
    let post = posts.find((post: any) => post.id === id)

    if (!post) {
        return null;
    }

    post = Object.assign(post, data)
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