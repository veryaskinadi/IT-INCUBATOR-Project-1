const basicAuth = require('express-basic-auth')

export const authMiddleWare = basicAuth({
    users: { 'admin': 'qwerty' }
})
