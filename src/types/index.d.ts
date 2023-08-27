import { UserDBType } from '../presentation/models/UserDBType'

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}