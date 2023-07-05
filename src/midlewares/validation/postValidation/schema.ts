import {CustomValidator} from "express-validator";
import {Blog, blogs} from "../../../routes/blogs-router";

export const postSchema = {
    title: {
        exists: {
            bail: true,
            errorMessage: 'Неверный заголовок',
        },
        isString: {
            bail: true,
            errorMessage: 'Неверный заголовок',
        },
        trim: true,
        notEmpty: {
            bail: true,
            errorMessage: 'Неверный заголовок',
        },
        isLength: {
            bail: true,
            options: {max: 30 },
            errorMessage: 'Неверный заголовок',
        },

    },
    shortDescription: {
        exists: {
            bail: true,
            errorMessage: 'Неверное описание',
        },
        isString: {
            bail: true,
            errorMessage: 'Неверное описание',
        },
        trim: true,
        notEmpty: {
            bail: true,
            errorMessage: 'Неверное описание',
        },
        isLength: {
            bail: true,
            options: { max: 100 },
            errorMessage: 'Неверное описание',
        },
    },
    content: {
        exists: {
            bail: true,
            errorMessage: 'Неверный контент',
        },
        isString: {
            bail: true,
            errorMessage: 'Неверный контент',
        },
        trim: true,
        notEmpty: {
            bail: true,
            errorMessage: 'Неверный контент',
        },
        isLength: {
            bail: true,
            options: { max: 1000 },
            errorMessage: 'Неверный контент',
        },
    },
    blogId: {
        exists: {
            bail: true,
            errorMessage: 'Неверный id блога',
        },
        notEmpty: true,
        isString: true,
        // custom: (field) => {
        //     let blog = blogs.find((blog: Blog) => blog.id === field)
        //
        //     if(!blog){
        //         throw new Error('Неверный id блога')
        //     }
        //
        //     return true
        // }
    },
}