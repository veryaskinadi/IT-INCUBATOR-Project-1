import { registrationSchema } from "./registrationSchema";
import { Request, Response, NextFunction } from "express";
import { checkSchema, FieldValidationError, validationResult } from "express-validator";
import {registrationResendingSchema} from "./registrationResendingSchema";

type ValidationError = {
    message: string;
    field: string;
}

export async function registrationResendingValidator (request: Request, response: Response, next: NextFunction) {
    await checkSchema(registrationResendingSchema).run(request);
    const errors = validationResult(request);

    let errorsMessages: ValidationError[] = [];

    if (!errors.isEmpty()) {
        errorsMessages = errors.array({ onlyFirstError: true }).map(error => ({
            message: error.msg,
            field: (error as FieldValidationError).path,
        }))
    }

    if ( errorsMessages.length > 0 ) {
        return response.status(401).send({errorsMessages})
    } else {
        next()
    }
}
