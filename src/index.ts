import express, {Request, Response} from 'express';

const app = express();
const port = 8080;

type Blogs = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
}

const data: Blogs[] = [];


app.get('/videos', (request: Request, response: Response) => {
    response.status(200).send(data);
});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );