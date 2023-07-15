import * as blogsRepository from "../../store/repositories/blogs-repository";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {Blog} from "../models/blogModel";
import {UpdateBlogModel} from "../models/UpdateBlogModel";
import {Paginator} from "../models/Paginator";
import {GetQueryModel} from "../models/GetQueryModel";

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
};

export const getAllBlogs = async (data: GetQueryModel): Promise<Paginator<Blog>> => {
    const blogsPaginator = await blogsRepository.getAllBlogs(data)
    const allBlogs = blogsPaginator.items.map(blog => ({
            ...blog,
            isMembership: false,
        })
    )

    return {
        pagesCount: blogsPaginator.pagesCount,
        page: blogsPaginator.page,
        pageSize: blogsPaginator.pageSize,
        totalCount: blogsPaginator.totalCount,
        items: allBlogs,
    }
};

export const updateBlog = async(id: string, data: UpdateBlogModel): Promise<void> => {
    await blogsRepository.updateBlog(id, data);
};

export const getBlog = async (id: string): Promise<Blog | null> => {
    const blogResult = await blogsRepository.getBlogById(id)
    if (!blogResult) {
        return null;
    }
    const blog = {
        ...blogResult,
        isMembership: false,
    };
    return blog;
};

export const deleteBlog = async (id: string): Promise<void> => {
    await blogsRepository.deleteBlogById(id);
};

export const deleteBlogs = async () => {
    try {
        await blogsRepository.deleteBlogs();
        return true;
    } catch (error) {
        return false;
    }
}