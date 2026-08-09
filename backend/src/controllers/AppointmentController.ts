import type { Request, Response } from "express";
import { AppointmentService, appointmentService } from "../services/AppointmentService";
import { SORT_CRITERIA, type SortCriterion } from "../utils/sorting";
import { AppError } from "../utils/errorTreatment";
import type { UserToken } from "../models/User";

function paramId(value: unknown, name = "id"): number {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(`O parâmetro "${name}" deve ser um número inteiro positivo`, 400, "PARAMETRO_INVALIDO")
    }
    return parsed
}

function queryText(value: unknown): string {
    return typeof value === "string" ? value : ""
}

function queryInt(value: unknown, name: string, defaultValue: number): number {
    if (!value) return defaultValue
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(`O parâmetro "${name}" deve ser um número inteiro positivo`, 400, "PARAMETRO_INVALIDO")
    }
    return parsed
}

function queryOption(value: unknown, options: SortCriterion[], defaultValue: SortCriterion, name: string): SortCriterion {
    if (!value) return defaultValue
    if (!options.includes(value as SortCriterion)) {
        throw new AppError(`O parâmetro "${name}" deve ser um destes valores: ${options.join(", ")}`, 400, "PARAMETRO_INVALIDO")
    }
    return value as SortCriterion
}

function userFrom(req: Request): UserToken {
    if (!req.user) {
        throw new AppError("Sessão expirada ou inexistente", 401, "NAO_AUTENTICADO")
    }
    return req.user
}

class AppointmentController {
    constructor(private readonly service: AppointmentService) { }

    async list(req: Request, res: Response) {
        const data = await this.service.search(queryText(req.query.busca))
        return res.status(200).json({
            message: "Agendamentos encontrados com sucesso!",
            data
        })
    }

    async listSorted(req: Request, res: Response) {
        const criterion = queryOption(req.query.criterio, SORT_CRITERIA, "data", "criterio")
        const data = await this.service.listSorted(criterion)
        return res.status(200).json({
            message: "Agendamentos ordenados com sucesso!",
            data
        })
    }

    async listUpcoming(req: Request, res: Response) {
        const hours = queryInt(req.query.horas, "horas", 24)
        const data = await this.service.listUpcoming(hours)
        return res.status(200).json({
            message: "Agendamentos próximos encontrados com sucesso!",
            data
        })
    }

    async findById(req: Request, res: Response) {
        const id = paramId(req.params.id)
        const data = await this.service.findById(id)
        return res.status(200).json({
            message: `Agendamento id: ${id} encontrado!`,
            data
        })
    }

    async create(req: Request, res: Response) {
        const result = await this.service.create(req.body, userFrom(req).id)
        return res.status(201).json({
            message: "Agendamento criado com sucesso!",
            data: result.data,
            alertas: result.alertas
        })
    }

    async update(req: Request, res: Response) {
        const id = paramId(req.params.id)
        const result = await this.service.update(req.body, id, userFrom(req).id)
        return res.status(200).json({
            message: "Agendamento editado com sucesso!",
            data: result.data,
            alertas: result.alertas
        })
    }

    async remove(req: Request, res: Response) {
        const id = paramId(req.params.id)
        await this.service.remove(id, userFrom(req).id)
        return res.status(200).json({
            message: "Agendamento excluído com sucesso!"
        })
    }
}

export const appointmentController = new AppointmentController(appointmentService)
