export type GetQueryFeedbackModel = {
    filter?: {postId: string},
    postId: string,
    userId:string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
}