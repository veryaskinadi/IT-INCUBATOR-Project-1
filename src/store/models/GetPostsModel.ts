export type GetPostsModel= {
    filter?: {blogId: string},
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
}