import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'


console.log(process.env.MONGO_URL)