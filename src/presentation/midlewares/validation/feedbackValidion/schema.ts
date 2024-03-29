export const feedbackSchema = {
    content: {
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

export const updateFeedbackSchema = {
    content: {
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