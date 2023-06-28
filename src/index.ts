import express, {Request, Response} from 'express';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({strict: false}));
const port = 8080;

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'admin': 'qwerty' }
}))

type ErrorsMessage = {
    message: String;
    field: String;
}

type Blog = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
}

function validationError(field: string, message: string): ErrorsMessage {
    return { message, field }
}

function validate(blogs: { [key: string]: unknown }): ErrorsMessage[] {
    const errorsMessages: ErrorsMessage[] = [];

    if (typeof blogs.name !== 'string' || !blogs.name.trim() || blogs.name.length > 15) {
        errorsMessages.push(validationError("name", "Wrong name" ))
    }

    if (typeof blogs.description !== 'string' || !blogs.description.trim() || blogs.description.length > 500) {
        errorsMessages.push(validationError("description", "Wrong description" ))
    }

    if (
        typeof blogs.websiteUrl !== 'string'
        || !blogs.websiteUrl.trim()
        || blogs.websiteUrl.length > 100
        || !blogs.websiteUrl.match(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/))  {
        errorsMessages.push(validationError("websiteUrl", "Wrong websiteUrl" ))
    }

    return errorsMessages;
}

const blogs: Blog[] = [];


app.get('/blogs', (request: Request, response: Response) => {
    response.status(200).send(blogs);
});

app.post('/blogs', (request: Request, response: Response) => {
    const errorsMessages = validate(request.body);
    if (errorsMessages.length > 0) {
        response.status(400).send({ errorsMessages });
    } else {
        const newBlog = {
            id: String(+(new Date())),
            ...request.body,
        }
        blogs.push(newBlog);
        response.status(201).send(newBlog);
    }
});

app.put('/blogs/:id', (request: Request, response: Response) => {
    let blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    if (!blog) {
        response.sendStatus(404);
        return
    }

    const errorsMessages = validate(request.body);
    if (errorsMessages.length > 0) {
        response.status(400).send({ errorsMessages });
        return
    }

    blog = Object.assign(blog, request.body)

    response.sendStatus(204);
});

app.get('/blogs/:id', (request: Request, response: Response) => {
    const blog = blogs.find((blog: Blog) => blog.id === request.params.id)
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.sendStatus(404)
    }
});

app.delete('/blogs/:id', (request: Request, response: Response) => {
    let blogIndex = blogs.findIndex(b => b.id === request.params.id)

    if(blogIndex === -1){
        response.sendStatus(404)
        return
    }

    blogs.splice(blogIndex, 1)
    response.sendStatus(204)
});


app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );