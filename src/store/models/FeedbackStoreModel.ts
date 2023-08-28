export type FeedbackStoreModel = {
    content: string;
    createdAt: string;
    id: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    };
}