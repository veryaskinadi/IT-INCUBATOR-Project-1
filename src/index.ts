import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";

const app = express();
app.use(bodyParser.json({strict: false}));
const port = 8080;

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'admin': 'qwerty' }
}))
app.use('/blogs', blogsRouter)


app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );