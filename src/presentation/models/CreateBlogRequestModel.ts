import {Request} from "express";

export type CreateBlogRequestModel = Request<{}, {}, {
    name: string;
    description: string;
    websiteUrl: string;
}>