const basicAuth = require('express-basic-auth')

export const authMiddleware = basicAuth({
    users: { 'admin': 'qwerty' }
})
