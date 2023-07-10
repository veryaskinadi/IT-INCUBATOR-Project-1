import {Blog, blogs} from "../store";
import {CreateBlogStoreModel} from "../models/CreateBlogStoreModel";
import {BlogStoreModel} from "../models/BlogStoreModel";
import {client, ObjId} from "../bd";
import {UpdateBlogModel} from "../models/UpdateBlogModel";

const blogsCollection = client.db().collection('blogs');

export const getAllBlogs = async (): Promise<BlogStoreModel[]> => {
    const blogs = await blogsCollection.find({}).toArray();
    const allBlogs = blogs.map(blog => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
    }));
    return allBlogs;
}

export const createBlog = async (data: CreateBlogStoreModel): Promise<BlogStoreModel> => {
    const result = await blogsCollection.insertOne({...data});
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updateBlog = async (id: string, data: UpdateBlogModel) => {
    await blogsCollection.updateOne({_id: new ObjId(id)}, { $set: data})
    return true;
}

export const findBlogById = (id: string) => {
    const blog = blogs.find((blog: Blog) => blog.id === id)
    if (blog) {
        return blog;
    } else {
        return null;
    }
}

export const removeBlogById = (id: string) => {
    let blogIndex = blogs.findIndex(b => b.id === id)

    if (blogIndex === -1) {
        return false;
    }

    blogs.splice(blogIndex, 1)
    return true;
}