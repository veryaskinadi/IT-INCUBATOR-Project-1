export type GetFeedbacksModel = {
    filter?: {postId: string},
    postId: string,
    userId: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize:number,
}