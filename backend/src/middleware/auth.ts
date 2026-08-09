import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/errorTreatment";
import { env } from "../env";
import type {
    Response, Request, NextFunction
} from "express";

const unauthorized = () => new AppError("Sessão expirada ou inexistente", 401, "NAO_AUTENTICADO")

export function auth(req: Request, _res: Response, next: NextFunction) {
    const token = req.cookies?.[env.cookieName];
    if (!token) return next(unauthorized())

    try {
        const payload = verifyAccessToken(token)
        if (!payload || typeof payload === "string") return next(unauthorized())

        req.user = {
            id: payload.id,
            nome: payload.nome,
            email: payload.email,
            perfil: payload.perfil
        }
        next();
    } catch {
        return next(unauthorized())
    }
}
