import { client, ObjId } from "../db";
import { FeedbackStoreModel } from '../models/FeedbackStoreModel';
import { CreateFeedbackStoreModel } from '../models/CreateFeedbackStoreModel'
import { Paginator } from "../models/Paginator";
import { Document } from "mongodb";
import { GetFeedbacksModel } from "../models/GetFeedbacksModel";
import { GetFeedbackStoreModel } from "../models/GetFeedbackStoreModel";

const feedbacksCollection = client.db().collection('feedbacks');

export const createFeedBack = async (data: CreateFeedbackStoreModel): Promise<FeedbackStoreModel> => {
    const result = await feedbacksCollection.insertOne({...data});
    return {
        content: data.content,
        createdAt: data.createdAt,
        id: result.insertedId.toString(),
        commentatorInfo: {
            userId: data.commentatorInfo.userId,
            userLogin: data.commentatorInfo.userLogin,
        }
    }
};

export const getAllFeedbacks = async (data: GetFeedbacksModel): Promise<Paginator<GetFeedbackStoreModel>> => {
    const offset = (data.pageNumber - 1) * data.pageSize;
    const sortBy = data.sortBy;

    const aggregatePipelines: Document[] = [
        { $sort: {[sortBy]: data.sortDirection === 'asc' ? 1 : -1} },
    ];

    if (data.filter?.postId) {
        aggregatePipelines.unshift({
            $match: { postId: data.filter.postId }
        })
    }

    const feedbacks = await feedbacksCollection
        .aggregate([
            ...aggregatePipelines,
            { $skip: offset },
            { $limit: data.pageSize },
        ])
        .toArray()

    const feedbacksTotalCount = await feedbacksCollection
        .aggregate([
            ...aggregatePipelines,
            { $count: "totalCount"},
        ])
        .toArray()

    let pagesCount = 0;
    let totalCount = 0;

    if (feedbacksTotalCount.length > 0) {
        totalCount = feedbacksTotalCount[0]?.totalCount;
        pagesCount = Math.ceil(totalCount / data.pageSize );
    }

    const allFeedbacks = feedbacks.map((feedback:any) => ({
        id: feedback._id.toString(),
        content: feedback.content,
        commentatorInfo: {
            userId: feedback.commentatorInfo.userId,
            userLogin: feedback.commentatorInfo.userLogin,
        },
        createdAt: feedback.createdAt,
    }));

    return {
        pagesCount: pagesCount,
        page: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: totalCount,
        items: allFeedbacks,
    }
};

export const getFeedbackById = async (id: string): Promise<FeedbackStoreModel | null> => {
    try {
        const feedback = await feedbacksCollection.findOne({_id: new ObjId(id)});
        if (!feedback) {
            throw new Error('Not found');
        }
        return {
            content: feedback.content,
            createdAt: feedback.createdAt,
            id: feedback._id.toString(),
            commentatorInfo: {
                userId: feedback.commentatorInfo.userId,
                userLogin: feedback.commentatorInfo.userLogin,
            }
        }
    } catch(error) {
        return null;
    }
};

export const deleteFeedbackById = async (id: string): Promise<void> => {
    await feedbacksCollection.deleteOne({_id: new ObjId(id)});
}

export const updateFeedback = async (id: string, content: string): Promise<void> => {
    await  feedbacksCollection.updateOne({_id: new ObjId(id)}, {$set: { content }});
}

