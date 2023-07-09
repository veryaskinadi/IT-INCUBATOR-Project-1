import * as blogsRepository from "../../store/repositories/blogs-repository";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {Blog} from "../models/blogModel";

export const createBlog = async (data: CreateBlogModel): Promise<Blog> => {
    const newData = {
        ...data,
        createdAt: new Date().toISOString(),
    }

    const newBlog = await blogsRepository.createBlog(newData)

    return {
        ...newBlog,
        isMembership: false,
    };
}