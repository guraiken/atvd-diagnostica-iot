import type { Request, Response } from "express";
import { AuthService, authService } from "../services/AuthService";
import { AppError } from "../utils/errorTreatment";
import { env } from "../env";
import type { UserToken } from "../models/User";

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    maxAge: 60 * 60 * 1000
}

function userFrom(req: Request): UserToken {
    if (!req.user) {
        throw new AppError("Sessão expirada ou inexistente", 401, "NAO_AUTENTICADO")
    }
    return req.user
}

class AuthController {
    constructor(private readonly service: AuthService) { }

    async login(req: Request, res: Response) {
        const { accessToken, user } = await this.service.login(req.body)
        res.cookie(env.cookieName, accessToken, COOKIE_OPTIONS)
        return res.status(200).json({
            message: "Usuário autenticado com sucesso!",
            data: user
        })
    }

    async logout(_req: Request, res: Response) {
        res.clearCookie(env.cookieName)
        return res.status(200).json({ message: "Sessão encerrada com sucesso!" })
    }

    async me(req: Request, res: Response) {
        const user = await this.service.getProfile(userFrom(req).id)
        return res.status(200).json({ data: user })
    }

    async register(req: Request, res: Response) {
        const createdUser = await this.service.register(req.body)
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            data: createdUser
        })
    }
}

export const authController = new AuthController(authService)
