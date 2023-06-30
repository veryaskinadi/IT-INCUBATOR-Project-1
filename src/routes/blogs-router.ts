import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {inputValidationMadleware} from "../midlewares/input-validation-midleware";


type Blog = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
}

const blogs: Blog[] = [];

const nameValidation = body('name').isString().isLength({max: 15}).trim();
const descriptionValidation = body('description').isString().isLength({max: 500}).trim();
const websiteUrlValidation = body('websiteUrl').isString().isLength({max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).trim()


export const blogsRouter = Router({})

blogsRouter.get('/', (request: Request, response: Response) => {
    response.status(200).send(blogs);
});

blogsRouter.post('/', nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMadleware, (request: Request, response: Response) => {

    const newBlog = {
        id: String(+(new Date())),
        ...request.body,
    }
    blogs.push(newBlog);
    response.status(201).send(newBlog);
});

blogsRouter.put('/:id', nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMadleware, (request: Request, response: Response) => {

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

