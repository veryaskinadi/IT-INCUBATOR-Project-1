import {blogs} from "../store";
import {CreateBlogStoreModel} from "../models/CreateBlogStoreModel";
import {BlogStoreModel} from "../models/BlogStoreModel";
import {client, ObjId} from "../bd";
import {Document} from "mongodb";
import {UpdateBlogModel} from "../models/UpdateBlogModel";
import {GetBlogsModel} from "../models/GetBlogsModel";
import {Paginator} from "../models/Paginator";

const blogsCollection = client.db().collection('blogs');

export const getAllBlogs = async (data: GetBlogsModel): Promise<Paginator<BlogStoreModel>> => {

    const offset = (data.pageNumber - 1) * data.pageSize;
    const sortBy = data.sortBy;

    const aggregatePipeline: Document[] = [
        { $sort: {[sortBy]: data.sortDirection === 'asc' ? 1 : -1} },
    ];

    if (data.searchNameTerm) {
        const searchNameTerm = new RegExp(`${data.searchNameTerm}`, 'i');
        aggregatePipeline.unshift({
            $match: {name: {$regex: searchNameTerm}}
        })
    }

    const blogs = await blogsCollection
        .aggregate([
            ...aggregatePipeline,
            { $skip: offset },
            { $limit: data.pageSize },
        ])
        .toArray()

    const blogsTotalCount = await blogsCollection
        .aggregate([
            ...aggregatePipeline,
            { $count: "totalCount"},
        ])
        .toArray()

   const pagesCount = Math.ceil(blogsTotalCount[0].totalCount / data.pageSize );

    const allBlogs = blogs.map((blog:any) => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
    }));

    return {
        pagesCount: pagesCount,
        page: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: blogsTotalCount[0].totalCount,
        items: allBlogs,
    }
}


export const createBlog = async (data: CreateBlogStoreModel): Promise<BlogStoreModel> => {
    const result = await blogsCollection.insertOne({...data});
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updateBlog = async (id: string, data: UpdateBlogModel): Promise<void> => {
    await blogsCollection.updateOne({_id: new ObjId(id)}, { $set: data});
}

export const getBlogById = async (id: string): Promise<BlogStoreModel | null>  => {
    try {
        const blog = await blogsCollection.findOne({_id: new ObjId(id)});
        if (!blog) {
            throw new Error('Not found');
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
        }
    } catch(error) {
        return null;
    }
}

export const deleteBlogById = async (id: string): Promise<void> => {
    await blogsCollection.deleteOne({_id: new ObjId(id)});
}

export const deleteBlogs = async () => {
    await blogsCollection.deleteMany({});
    return true;
}