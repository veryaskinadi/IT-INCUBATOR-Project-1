import * as feedbacksRepository from '../../store/repositories/feedbacks-repository'
import { Feedback } from "../models/feedbackModel";
import { User } from "../models/userModel";
import * as usersService from '../users/usersService'
import { Paginator } from "../models/Paginator";
import { GetQueryFeedbackModel } from '../models/GetQueryFeedbackModel';
import {SendFeedbackModel} from "../models/SendFeedbackModel";

export const sendFeedback = async (data: SendFeedbackModel): Promise<Feedback> => {
    const user = await usersService.getUser(data.userId) as User;

    const newData = {
        postId: data.postId,
        content: data.content,
        commentatorInfo: {
            userId: data.userId,
            userLogin: user.login,
        },
        createdAt: new Date().toISOString(),
    }

    const newProduct = await feedbacksRepository.createFeedBack(newData)

    return {
        id: newProduct.id,
        content: newProduct.content,
        commentatorInfo: {
            userId: newProduct.commentatorInfo.userId,
            userLogin: newProduct.commentatorInfo.userLogin,
        },
        createdAt: newProduct.createdAt,
    };
};

export const getAllFeedbacks = async (data: GetQueryFeedbackModel): Promise<Paginator<Feedback>> => {
    const feedbacsPaginator = await feedbacksRepository.getAllFeedbacks(data);
    const allFeedbacks = feedbacsPaginator.items.map(feedback => ({
        id: feedback.id,
        content: feedback.content,
        commentatorInfo: {
            userId: feedback.commentatorInfo.userId,
            userLogin: feedback.commentatorInfo.userLogin,
        },
        createdAt: feedback.createdAt,
        })
    )

    return {
        pagesCount: feedbacsPaginator.pagesCount,
        page: feedbacsPaginator.page,
        pageSize: feedbacsPaginator.pageSize,
        totalCount: feedbacsPaginator.totalCount,
        items: allFeedbacks,
    }
};

export const getFeedbackById = async (id: string): Promise<Feedback | null> => {
    const feedback = await feedbacksRepository.getFeedbackById(id)
    if (!feedback) {
        return null;
    }
    return feedback;
}