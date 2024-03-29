import {posts} from "../store";
import {CreatePostStoreModel} from "../models/CreatePostStoreModel";
import {PostStoreModel, PostStoreModelWithBlog} from "../models/PostStoreModel";
import {client, ObjId} from "../db";
import {Document} from "mongodb";
import {UpdateBlogModel} from "../models/UpdatePostModel";
import {GetPostsModel} from "../models/GetPostsModel";
import {Paginator} from "../models/Paginator";

export const postsCollection = client.db().collection('posts');

export const getPosts = async (data: GetPostsModel): Promise<Paginator<PostStoreModelWithBlog>> => {

    const offset = (data.pageNumber - 1) * data.pageSize;
    const sortBy = data.sortBy === 'blogName' ? 'blog.name' : data.sortBy;

    const aggregatePipeline: Document[] = [
        {
            $lookup: {
                from: "blogs",
                localField: "blogId",
                foreignField: "_id",
                as: "blog"
            }
        },
        { $unwind: "$blog"},
        { $sort: {[sortBy]: data.sortDirection === 'asc' ? 1 : -1} },
    ];

    if (data.filter?.blogId) {
        aggregatePipeline.unshift({
            $match: { blogId: new ObjId(data.filter.blogId) }
        })
    }

    // if (data.filter) {
    //     aggregatePipeline.unshift( {
    //         $match: {
    //             ...data.filter,
    //             blogId: new ObjId(data.filter.blogId),
    //         }
    //     })
    // }

    const posts = await postsCollection
        .aggregate([
            ...aggregatePipeline,
            { $skip: offset },
            { $limit: data.pageSize },
        ])
        .toArray();

    const postsTotalCount = await postsCollection
        .aggregate([
            ...aggregatePipeline,
            { $count: "totalCount"},
        ])
        .toArray()

    let pagesCount = 0;
    let totalCount = 0;

    if (postsTotalCount.length > 0) {
        totalCount = postsTotalCount[0]?.totalCount;
        pagesCount = Math.ceil(totalCount / data.pageSize )
    }

    const allPosts = posts.map(post => {
        const preparedPost: PostStoreModelWithBlog = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
            blogId: post.blogId
        }

        if (post.blog) {
            preparedPost.blog = {
                id: post.blog._id.toString,
                name: post.blog.name,
                description: post.blog.description,
                websiteUrl: post.blog.websiteUrl,
                createdAt: post.blog.createdAt,
            }
        }
       return preparedPost;
    });

    return {
        pagesCount: pagesCount,
        page: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: totalCount,
        items: allPosts,
    };
}

export const createPost = async (data: CreatePostStoreModel): Promise<PostStoreModel> => {
    const result = await postsCollection.insertOne({
        ...data,
        blogId: new ObjId(data.blogId)
    });
    return {
        ...data,
        id: result.insertedId.toString(),
    }
}

export const updatePost = async (id: string, data: UpdateBlogModel): Promise<void> => {
    await postsCollection.updateOne({_id: new ObjId(id)}, { $set: {
        ...data,
        blogId: new ObjId(data.blogId)
    }});
}

export const getPostById = async (id: string): Promise<PostStoreModelWithBlog | null> => {
    try {
        const post = await postsCollection.findOne({_id: new ObjId(id)});
        if (!post) {
            throw new Error('Not found');
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            createdAt: post.createdAt
        }
    } catch(error) {
        return null;
    }
}

export const deletePostById = async (id: string): Promise<void> => {
    await postsCollection.deleteOne({_id: new ObjId(id)});
}

export const deletePosts = async () => {
    await postsCollection.deleteMany({});
    return true;
}