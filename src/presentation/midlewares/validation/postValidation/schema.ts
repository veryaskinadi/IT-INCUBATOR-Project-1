export const postSchema = {
    title: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 30 },
        },
        errorMessage: 'Неверный заголовок',
    },
    shortDescription: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 100 },
        },
        errorMessage: 'Неверное описание',
    },
    content: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 1000 },
        },
        errorMessage: 'Неверный контент',
    },
    blogId: {
        exists: true,
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