import {Blog, blogs} from "../store";

export const findBlogs = () => {return blogs}

export const createBlog = (data) => {
    const newBlog = {
        id: String(+(new Date())),
        ...data,
    }
    blogs.push(newBlog);
    return newBlog;
}

export const updateBlog = (id, data) => {
    let blog = blogs.find((blog: Blog) => blog.id === id)

    if (!blog) {
        return false
    }

    blog = Object.assign(blog, data)
    return true
}

export const findBlogById = id => {
    const blog = blogs.find((blog: Blog) => blog.id === id)
    if (blog) {
        return blog;
    } else {
        return null;
    }
}

export const removeBlogById = id => {
    let blogIndex = blogs.findIndex(b => b.id === id)

    if (blogIndex === -1) {
        return false;
    }

    blogs.splice(blogIndex, 1)
    return true;
}