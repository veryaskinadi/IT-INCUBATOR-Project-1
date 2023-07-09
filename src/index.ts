import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./presentation/routes/blogs-router";
import {postsRouter} from "./presentation/routes/posts-router";
import {testingRouter} from "./presentation/routes/testing-router";
import {runDb} from "./store/bd";


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