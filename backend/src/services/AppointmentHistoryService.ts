import { AppointmentHistoryRepository, appointmentHistoryRepository } from "../repositories/AppointmentHistoryRepository"

export class AppointmentHistoryService {
    constructor(private readonly repository: AppointmentHistoryRepository) { }

    async list() {
        return this.repository.list()
    }
}

export const appointmentHistoryService = new AppointmentHistoryService(appointmentHistoryRepository)
