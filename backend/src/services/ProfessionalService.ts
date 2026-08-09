import { ProfessionalRepository, professionalRepository } from "../repositories/ProfessionalRepository"
import { AppError } from "../utils/errorTreatment"

export class ProfessionalService {
    constructor(private readonly repository: ProfessionalRepository) { }

    async list() {
        return this.repository.list()
    }

    async listAvailability(professionalId: number) {
        const professional = await this.repository.findById(professionalId)
        if (!professional) throw new AppError("Profissional não encontrado", 404, "NAO_ENCONTRADO")

        return this.repository.listAvailability(professionalId)
    }
}

export const professionalService = new ProfessionalService(professionalRepository)
