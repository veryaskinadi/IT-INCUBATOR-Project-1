import {Request} from "express";

export type CreatePostRequestModel = Request<{}, {}, {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}>