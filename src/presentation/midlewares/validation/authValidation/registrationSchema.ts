export const registrationSchema = {
    login: {
        exists: true,
        isString: true,
        trim: true,
        isLength: {
            options: { max: 10, min: 3 },
        },
        matches: {
            options: (/^[a-zA-Z0-9_-]*$/),
        },
        notEmpty: true,
        errorMessage: 'Неверное имя, почта или пароль',
    },
    email: {
        exists: true,
        isString: true,
        trim: true,
        matches: {
            options: (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        },
        notEmpty: true,
        errorMessage: 'Неверное имя, почта или пароль',
    },
    password: {
        exists: true,
        isString: true,
        trim: true,
        isLength: {
            options: { max: 20, min: 6 },
        },
        notEmpty: true,
        errorMessage: 'Неверное имя, почта или пароль',
    },
}