import {Request, Response, Router} from "express";
import {body, validationResult} from "express-validator";


type Blog = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
}
const blogs: Blog[] = [];

const nameValidation = body('name').isString().isLength({min: 1, max: 15}).trim();
const descriptionValidation = body('description').isString().isLength({min: 1, max: 500}).trim();
const websiteUrlValidation = body('websiteUrl').isString().isLength({min: 1, max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).trim()



export const blogsRouter = Router({})

blogsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(blogs);
});

blogsRouter.post('/', nameValidation, descriptionValidation, websiteUrlValidation, (request: Request, response: Response) => {
    const errors = validationResult(request)

    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()})
    }

    const newBlog = {
        id: String(+(new Date())),
        ...request.body,
    }
    blogs.push(newBlog);
    response.status(201).send(newBlog);
});

blogsRouter.put('/:id', nameValidation, descriptionValidation, websiteUrlValidation, (request: Request, response: Response) => {
    const errors = validationResult(request)

    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()})
    }

    // let blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    // if (!blog) {
    //     response.sendStatus(404);
    //     return
    // }
    //
    // const errorsMessages = validate(request.body);
    // if (errorsMessages.length > 0) {
    //     response.status(400).send({ errorsMessages });
    //     return
    // }
    let blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    if (blog) {
        blog = Object.assign(blog, request.body)
        response.sendStatus(204);
    }

});

blogsRouter.get('/:id', (request: Request, response: Response) => {
    const blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.sendStatus(404)
    }
});

blogsRouter.delete('/:id', (request: Request, response: Response) => {
    let blogIndex = blogs.findIndex(b => b.id === request.params.id)

    if(blogIndex === -1){
        response.sendStatus(404)
        return
    }

    blogs.splice(blogIndex, 1)
    response.sendStatus(204)
});

