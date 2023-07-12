import {blogs} from "../store";
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
    await blogsCollection.updateOne({_id: new ObjId(id)}, { $set: data});
    return true;
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