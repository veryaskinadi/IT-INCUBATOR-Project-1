import jwt from 'jsonwebtoken';
import {settings} from "./settings";
import {UserDBType} from "../models/UserDBType";

export const jwtService = {
    async createJWT(user: UserDBType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return token;
    },
    async getUserIdByToken (token: string){
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        }
        catch (e) {
            return null
        }
    }
}