import type { UserToken } from "../models/User"

declare global {
    namespace Express {
        interface Request {
            user?: UserToken
        }
    }
}

export {}
