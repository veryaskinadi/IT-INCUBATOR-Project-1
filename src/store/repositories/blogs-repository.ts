import {Blog, blogs} from "../store";
import {CreateBlogStoreModel} from "../models/CreateBlogStoreModel";
import {BlogStoreModel} from "../models/BlogStoreModel"
import {client} from "../bd"

const blogsCollection = client.db().collection('blogs');


export const findBlogs = () => {return blogs}

export const createBlog = async (data: CreateBlogStoreModel): Promise<BlogStoreModel> => {
    const result = await blogsCollection.insertOne(data)
    return {
        ...data,
        id: result.insertedId
    }
}

export const updateBlog = (id: string, data: any) => {
    let blog = blogs.find((blog: Blog) => blog.id === id)

    if (!blog) {
        return false
    }

    blog = Object.assign(blog, data)
    return true
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