import {Request} from "express";

export type CreatePostByBlogIdRequestModel = Request<{ blogId: string; }, {}, {
    title: string;
    shortDescription: string;
    content: string;
}>