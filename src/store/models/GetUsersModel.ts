export type GetUsersModel= {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize:number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}