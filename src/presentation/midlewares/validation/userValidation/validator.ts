import { createUserSchema } from "./schema"
import { Request, Response, NextFunction } from "express";
import { checkSchema, FieldValidationError, validationResult } from "express-validator";

type ValidationError = {
    message: string;
    field: string;
}

export async function createUserValidator (request: Request, response: Response, next: NextFunction) {
    await checkSchema(createUserSchema).run(request);
    const errors = validationResult(request);

    let errorsMessages: ValidationError[] = [];

    if (!errors.isEmpty()) {
        errorsMessages = errors.array({ onlyFirstError: true }).map(error => ({
            message: error.msg,
            field: (error as FieldValidationError).path,
        }))
    }

    if ( errorsMessages.length > 0 ) {
        return response.status(400).send({errorsMessages})
    } else {
        next()
    }
}
