export const createBlogSchema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 15 },
        },
        errorMessage: 'Неверное имя',
    },
    description: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 500 },
        },
        errorMessage: 'Неверное описание',
    },
    websiteUrl: {
        exists: true,
        trim: true,
        notEmpty: true,
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            options: (/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
        },
        errorMessage: 'Неверный адрес',
    },
}

export const updateBlogSchema = {
    name: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {max: 15 },
        },
        errorMessage: 'Неверное имя',
    },
    description: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 500 },
        },
        errorMessage: 'Неверное описание',
    },
    websiteUrl: {
        exists: true,
        trim: true,
        notEmpty: true,
        isString: true,
        isLength: {
            options: { max: 100 },
        },
        matches: {
            options: (/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
        },
        errorMessage: 'Неверный адрес',
    },
}