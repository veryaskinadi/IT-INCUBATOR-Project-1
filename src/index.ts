import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./presentation/routes/blogs-router";
import {postsRouter} from "./presentation/routes/posts-router";
import {testingRouter} from "./presentation/routes/testing-router";
import {auth} from "./presentation/routes/auth-router";
import {users} from "./presentation/routes/users-router";

import {runDb} from "./store/bd";


const app = express();
app.use(bodyParser.json({strict: false}));
const port = 8080;

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingRouter);
app.use('/users', users);
app.use('/auth', auth);


const startApp = async () => {
    await runDb();
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );
}

startApp()