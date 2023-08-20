export const authSchema = {
    loginOrEmail: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        errorMessage: 'Неверное имя или пароль',
    },
    password: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        errorMessage: 'Неверное имя или пароль',
    },
}