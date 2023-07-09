import {Blog, blogs} from "./store";
import {blogsCollection} from "./bd";

export const findBlogs = () => {return blogs}

export const createBlog = async (data: any) => {
    try {
        const result = await blogsCollection.insertOne(data)
        return {
            ...data,
            _id: result.insertedId
        }
    } catch (e) {
        console.log(e);
    }

}

export const updateBlog = (id: string, data: Blog) => {
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