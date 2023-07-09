import {posts, Post, blogs, Blog} from "./store";

export const findPosts = () => {return posts}

export const createPost = (data: any, blogId: string) => {
    let blog = blogs.find((blog: any) => blog.id === blogId)
    if (!blog) {
        return null
    }
    const newPost = {
        blogName: blog.name,
        ...data,
    }
    newPost.id = String(+(new Date()))
    posts.push(newPost);
    return newPost;
}

export const updatePost = (id: string, data: any) => {
    let post = posts.find((post: any) => post.id === id)

    if (!post) {
        return null;
    }

    post = Object.assign(post, data)
    return true;
}

export const findPostById = (id: string) => {
    const post = posts.find((post: Post) => post.id === id)
    if (post) {
        return post;
    } else {
        return false;
    }
}

export const removePostById = (id: string) => {
    let postIndex = posts.findIndex(b => b.id === id)

    if(postIndex === -1){
        return null;
    }
    posts.splice(postIndex, 1)
    return true;
}