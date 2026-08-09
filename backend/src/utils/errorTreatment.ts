export class AppError extends Error {
    status: number
    code: string

    constructor(message: string, status = 400, code = "ERRO_NEGOCIO") {
        super(message)
        this.name = "AppError"
        this.status = status
        this.code = code
    }
}
