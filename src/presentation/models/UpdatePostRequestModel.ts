import {Request} from "express";

type UpdatePostRequestBodyModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type UpdatePostRequestModel = Request<{ id: string; }, {}, UpdatePostRequestBodyModel>