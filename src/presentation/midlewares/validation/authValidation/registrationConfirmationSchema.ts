export const registrationConfirmationSchema = {
    code: {
        exists: true,
        isString: true,
    }
}