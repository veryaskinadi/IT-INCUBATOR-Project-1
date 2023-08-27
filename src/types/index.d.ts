import { UserDBType } from '../presentation/models/UserDBType'

export {}

declare global {
    namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}