export const settings = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || "123",
    PORT: process.env.PORT || "8080",
    HOST: process.env.HOST || "localhost"
}