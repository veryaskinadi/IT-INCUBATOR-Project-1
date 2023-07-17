export type GetPostsQueryModel = {
    filter?: {blogId: string},
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
}