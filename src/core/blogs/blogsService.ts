import * as blogsRepository from "../../store/repositories/blogs-repository";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {Blog} from "../models/blogModel";
import {UpdateBlogModel} from "../models/UpdateBlogModel";

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

export const getAllBlogs = async (): Promise<Blog[]> => {
    const blogs = await blogsRepository.getAllBlogs()
    const allBlogs = blogs.map( blog => ({
            ...blog,
            isMembership: false,
        })
    )
    return allBlogs;
}

export const updateBlog = async(id: string, data: UpdateBlogModel) => {
    try {
        await blogsRepository.updateBlog(id, data);
        return true;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}