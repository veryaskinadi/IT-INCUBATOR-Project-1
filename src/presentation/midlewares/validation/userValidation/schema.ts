export const createUserSchema = {
    login: {
        exists: true,
        isString: true,
        trim: true,
        //notEmpty: true,
        isLength: {
            options: { max: 10, min: 3 },
        },
        matches: {
            options: (/^[a-zA-Z0-9_-]*$/),
        },
        errorMessage: 'Неверное имя',
    },
    password: {
        exists: true,
        isString: true,
        trim: true,
        //notEmpty: true,
        isLength: {
            options: { max: 20, min: 6 },
        },
        errorMessage: 'Неверный пароль',
    },
    email: {
        exists: true,
        trim: true,
        notEmpty: true,
        isString: true,
        matches: {
            options: (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        },
        errorMessage: 'Неверный адрес',
    },
}