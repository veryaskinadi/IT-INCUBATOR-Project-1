import {BlogStoreModel} from "./BlogStoreModel";

export type PostStoreModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    createdAt: string;
}

export type PostStoreModelWithBlog = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: string;
    blogId: string;
    blog?: BlogStoreModel;
}