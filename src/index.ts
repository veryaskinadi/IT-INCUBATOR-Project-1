import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";
import {runDb} from "./repositories/bd";


const app = express();
app.use(bodyParser.json({strict: false}));
const port = 8080;

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingRouter);

const startApp = async () => {
    await runDb();
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );
}

startApp()