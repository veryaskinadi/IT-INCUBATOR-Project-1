import * as blogsRepository from "../../store/repositories/blogs-repository";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {Blog} from "../models/blogModel";

export const createBlog = async (data: CreateBlogModel): Promise<Blog> => {
    return await blogsRepository.createBlog(data)
}