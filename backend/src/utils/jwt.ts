import jwt from 'jsonwebtoken'
import { env } from '../env'
import type { UserRole } from '../models/User'

interface TokenPayload {
    id: number
    nome: string
    email: string
    perfil: UserRole
}

interface DecodedToken extends TokenPayload {
    iat: number,
    exp: number
}

export function signAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, env.accessKey, {
        expiresIn: '1h'
    })
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, env.accessKey)
}

export function decodeToken(token: string): DecodedToken {
    return jwt.decode(token) as DecodedToken;
}
