import {MongoClient, ObjectId} from "mongodb";

export type Post = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    _id?: ObjectId;
}

export const ObjId = ObjectId;

const url = "mongodb+srv://veryaskinadi:ITPROJECT01@itproject01.l2ugdjm.mongodb.net/?retryWrites=true&w=majority"
export const client = new MongoClient(url);

export const postsCollection = client.db().collection<Post>('posts');

export const runDb = async () => {
    try {
        await client.connect();
    } catch (e) {
        await client.close();
    }
}