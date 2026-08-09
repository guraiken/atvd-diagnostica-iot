import type { Request, Response } from "express";
import { ProfessionalService, professionalService } from "../services/ProfessionalService";
import { AppError } from "../utils/errorTreatment";

function paramId(value: unknown, name = "id"): number {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(`O parâmetro "${name}" deve ser um número inteiro positivo`, 400, "PARAMETRO_INVALIDO")
    }
    return parsed
}

class ProfessionalController {
    constructor(private readonly service: ProfessionalService) { }

    async list(_req: Request, res: Response) {
        const data = await this.service.list()
        return res.status(200).json({
            message: "Profissionais encontrados com sucesso!",
            data
        })
    }

    async listAvailability(req: Request, res: Response) {
        const professionalId = paramId(req.params.id)
        const data = await this.service.listAvailability(professionalId)
        return res.status(200).json({
            message: "Disponibilidade encontrada com sucesso!",
            data
        })
    }
}

export const professionalController = new ProfessionalController(professionalService)
