import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/errorTreatment"

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof AppError) {
        return res.status(error.status).json({
            error: error.message,
            code: error.code
        })
    }

    console.error(error)
    return res.status(500).json({
        error: "Ocorreu um erro inesperado no servidor",
        code: "ERRO_INTERNO"
    })
}
