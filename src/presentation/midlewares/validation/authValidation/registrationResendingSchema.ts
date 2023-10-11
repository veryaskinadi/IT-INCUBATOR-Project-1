export const registrationResendingSchema = {
    email: {
        exists: true,
        isString: true,
        trim: true,
        matches: {
            options: (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        },
        notEmpty: true,
        errorMessage: 'Неверный почтовый адрес',
    }
}