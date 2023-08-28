export type CreateFeedbackStoreModel = {
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    };
    createdAt: string;
}