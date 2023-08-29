export const feedbackSchema = {
    comments: {
        exists: true,
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { max: 300, min: 20 },
        },
        errorMessage: 'Неверный контент',
    },
}