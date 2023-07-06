import { postSchema } from "./schema"
import { Request, Response, NextFunction } from "express";
import {checkSchema, FieldValidationError, validationResult} from "express-validator";
import {Blog, blogs} from "../../../store";

type ValidationError = {
    message: string;
    field: string;
}

export async function createPostValidator(request: Request, response: Response, next: NextFunction) {
    await checkSchema(postSchema).run(request);
    const errors = validationResult(request);

    let errorsMessages: ValidationError[] = [];

    if (!errors.isEmpty()) {
        errorsMessages = errors.array({ onlyFirstError: true }).map(error => ({
            message: error.msg,
            field: (error as FieldValidationError).path,
        }))
    }

    let blog = blogs.find((blog: Blog) => blog.id === request.body.blogId)
    if (!blog) {
        errorsMessages.push({
            message: "Неверный blogId",
            field: "blogId"
        })
    }

    if ( errorsMessages.length > 0 ) {
        return response.status(400).send({errorsMessages})
    } else {
        next()
    }
}