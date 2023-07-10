import {Request} from "express";

type UpdateBlogRequestBodyModel = { name: string; description: string; websiteUrl: string; }

export type UpdateBlogRequestModel = Request<{ id: string; }, {}, UpdateBlogRequestBodyModel>