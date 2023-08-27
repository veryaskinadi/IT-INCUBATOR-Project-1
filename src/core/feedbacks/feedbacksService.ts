import * as feedbacksRepository from '../../store/repositories/feedbacks-repository'
import {Feedback} from "../models/feedbackModel";
import {User} from "../models/userModel";
import * as usersService from '../users/usersService'

export const sendFeedback = async (content: string, userId: string): Promise<Feedback> => {
    const newData = {
        content: content,
        createdAt: new Date().toISOString(),
    }

    const user = await usersService.getUser(userId) as User;

    const newProduct = await feedbacksRepository.createFeedBack(newData)

    return {
        id: newProduct.id,
        content: newProduct.content,
        commentatorInfo: {
            userId: userId,
            userLogin: user.login,
        },
        createdAt: newProduct.createdAt,
    };
}