import {posts, Post, blogs, Blog} from "../store";

export const findPosts = () => {return posts}

export const createPost = (data, blogId) => {
    let blog = blogs.find((blog: Blog) => blog.id === blogId)
    if (!blog) {
        return null
    }
    const newPost = {
        id: String(+(new Date())),
        blogName: blog.name,
        ...data,
    }
    posts.push(newPost);
    return newPost;
}

export const updatePost = (id, data) => {
    let post = posts.find((post: Post) => post.id === id)

    if (!post) {
        return null;
    }

    post = Object.assign(post, data)
    return true;
}

export const findPostById = id => {
    const post = posts.find((post: Post) => post.id === id)
    if (post) {
        return post;
    } else {
        return false;
    }
}

export const removePostById = id => {
    let postIndex = posts.findIndex(b => b.id === id)

    if(postIndex === -1){
        return null;
    }
    posts.splice(postIndex, 1)
    return true;
}