import { client, ObjId } from "../db";
import { FeedbackStoreModel } from '../models/FeedbackStoreModel';
import { CreateFeedbackStoreModel } from '../models/CreateFeedbackStoreModel'

export const feedbacksCollection = client.db().collection('feedbacks');

export const createFeedBack = async (data: CreateFeedbackStoreModel): Promise<FeedbackStoreModel> => {
    const result = await feedbacksCollection.insertOne({...data});
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}