import {NextFunction, Request, Response} from "express";
import {validationResult, FieldValidationError} from "express-validator";

export const inputValidationMadleware = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        const errorsMessages = errors.array({ onlyFirstError: true }).map(error => ({
            message: error.msg,
            field: (error as FieldValidationError).path,
        }))
        // return response.status(400).json({errors: errors.array()})
        return response.status(400).send({errorsMessages})
    } else {
        next()
    }
}