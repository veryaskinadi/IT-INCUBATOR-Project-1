import {MongoClient, ObjectId} from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

export const ObjId = ObjectId;

const url = process.env.MONGO_URL;

if(!url) {
    throw new Error("Wrong URL")
}

export const client = new MongoClient(url);

export const runDb = async () => {
    try {
        await client.connect();
    } catch (e) {
        console.log(e)
        await client.close();
        throw e
    }
}