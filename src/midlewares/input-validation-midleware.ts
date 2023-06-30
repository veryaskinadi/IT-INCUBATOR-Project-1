import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMadleware = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    let item: string = "Name";

    if(!errors.isEmpty()){
        let errorsMessage = {
            "errorsMessages": [
                {
                    "message": "Wrong ${item}",
                    "field": "${item}"
                }
            ]
        }
        // return response.status(400).json({errors: errors.array()})
        return response.status(400).send(errorsMessage)
    } else {
        next()
    }
}