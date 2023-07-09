import {MongoClient, ObjectId} from "mongodb";

export type Blog = {
    name: string;
    description: string;
    websiteUrl: string;
    _id?: ObjectId;
}

export type Post = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    _id?: ObjectId;
}

const url = "mongodb+srv://veryaskinadi:ITPROJECT01@itproject01.l2ugdjm.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url);

export const blogsCollection = client.db().collection<Blog>('blogs');
export const postsCollection = client.db().collection<Post>('posts');

export const runDb = async () => {
    try {
        await client.connect();
    } catch (e) {
        console.log(e)
        await client.close();
    }
}