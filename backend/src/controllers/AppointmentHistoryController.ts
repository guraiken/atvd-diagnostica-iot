import type { Request, Response } from "express";
import { AppointmentHistoryService, appointmentHistoryService } from "../services/AppointmentHistoryService";

class AppointmentHistoryController {
    constructor(private readonly service: AppointmentHistoryService) { }

    async list(_req: Request, res: Response) {
        const data = await this.service.list()
        return res.status(200).json({
            message: "Histórico encontrado com sucesso!",
            data
        })
    }
}

export const appointmentHistoryController = new AppointmentHistoryController(appointmentHistoryService)
