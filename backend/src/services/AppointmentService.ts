import { AppointmentRepository, appointmentRepository } from "../repositories/AppointmentRepository"
import { CustomerRepository, customerRepository } from "../repositories/CustomerRepository"
import { ProfessionalRepository, professionalRepository } from "../repositories/ProfessionalRepository"
import { AppError } from "../utils/errorTreatment"
import { mergeSort, type SortCriterion } from "../utils/sorting"
import {
    nowLocal, weekdayOf, minutesFromTime, minutesOfDay, normalizeDateTime, addHoursLocal
} from "../utils/dateTime"
import type { AppointmentInput, Alert, CleaningType } from "../models/Appointment"

const VALID_TYPES: CleaningType[] = ["RESIDENCIAL", "COMERCIAL"]

export class AppointmentService {
    constructor(
        private readonly repository: AppointmentRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly professionalRepository: ProfessionalRepository
    ) { }

    async list() {
        return this.repository.list()
    }

    async findById(id: number) {
        const appointment = await this.repository.findById(id)
        if (!appointment) throw new AppError("Agendamento não encontrado", 404, "NAO_ENCONTRADO")
        return appointment
    }

    async search(term: string) {
        if (!term?.trim()) return this.repository.list()
        return this.repository.search(term.trim())
    }

    async listUpcoming(hours: number) {
        return this.repository.listUpcoming(nowLocal(), addHoursLocal(hours))
    }

    async listSorted(criterion: SortCriterion) {
        const list = await this.repository.listUnsorted()
        return mergeSort(list, criterion)
    }

    async create(data: AppointmentInput, userId: number) {
        const validatedData = await this.validateData(data, { validatePast: true })

        const alerts = await this.raiseAlerts(validatedData)
        const appointment = await this.repository.create(validatedData, userId)
        const details = await this.repository.findById(appointment.id)

        return { data: details, alertas: alerts }
    }

    async update(data: AppointmentInput, id: number, userId: number) {
        const existing = await this.repository.findById(id)
        if (!existing) throw new AppError("Agendamento não encontrado", 404, "NAO_ENCONTRADO")

        const validatedData = await this.validateData(data, { validatePast: false })

        const alerts = await this.raiseAlerts(validatedData, id)
        await this.repository.update(validatedData, id, userId)
        const details = await this.repository.findById(id)

        return { data: details, alertas: alerts }
    }

    async remove(id: number, userId: number) {
        const existing = await this.repository.findById(id)
        if (!existing) throw new AppError("Agendamento não encontrado", 404, "NAO_ENCONTRADO")

        await this.repository.remove(id, existing.cliente_id, existing.profissional_id, userId)
    }

    private async raiseAlerts(data: AppointmentInput, ignoreId?: number): Promise<Alert[]> {
        const alerts: Alert[] = []

        const conflicts = await this.repository.findConflicts(
            data.profissional_id, data.data_hora_inicio, data.data_hora_fim, ignoreId
        )
        if (conflicts.length > 0) {
            alerts.push({
                tipo: "CONFLITO_HORARIO",
                mensagem: "Este profissional já possui outro serviço agendado neste intervalo de horário."
            })
        }

        const weekday = weekdayOf(data.data_hora_inicio)
        const windows = await this.repository.findAvailability(data.profissional_id, weekday)
        const startMinutes = minutesOfDay(data.data_hora_inicio)
        const endMinutes = minutesOfDay(data.data_hora_fim)
        const fitsInSomeWindow = windows.some(
            (window) => startMinutes >= minutesFromTime(window.hora_inicio) && endMinutes <= minutesFromTime(window.hora_fim)
        )
        if (!fitsInSomeWindow) {
            alerts.push({
                tipo: "INDISPONIBILIDADE",
                mensagem: "O profissional não possui disponibilidade cadastrada para este dia e horário."
            })
        }

        return alerts
    }

    private async validateData(data: AppointmentInput, options: { validatePast: boolean }): Promise<AppointmentInput> {
        if (!data.cliente_id) throw new AppError("Selecione o cliente", 400, "CAMPO_OBRIGATORIO")
        if (!data.profissional_id) throw new AppError("Selecione o profissional", 400, "CAMPO_OBRIGATORIO")
        if (!data.endereco_id) throw new AppError("Selecione o endereço", 400, "CAMPO_OBRIGATORIO")
        if (!data.tipo || !VALID_TYPES.includes(data.tipo)) {
            throw new AppError("Selecione o tipo de faxina (residencial ou comercial)", 400, "CAMPO_INVALIDO")
        }
        if (!data.data_hora_inicio || !data.data_hora_fim) {
            throw new AppError("Informe a data e o horário do agendamento", 400, "CAMPO_OBRIGATORIO")
        }

        const start = normalizeDateTime(data.data_hora_inicio, "data_hora_inicio")
        const end = normalizeDateTime(data.data_hora_fim, "data_hora_fim")

        if (end <= start) {
            throw new AppError("O horário de término deve ser depois do horário de início", 400, "CAMPO_INVALIDO")
        }
        if (options.validatePast && start < nowLocal()) {
            throw new AppError("A data do agendamento não pode estar no passado", 400, "DATA_INVALIDA")
        }
        if (data.observacoes && data.observacoes.length > 500) {
            throw new AppError("As observações devem ter no máximo 500 caracteres", 400, "CAMPO_INVALIDO")
        }

        const customer = await this.customerRepository.findById(data.cliente_id)
        if (!customer) throw new AppError("Cliente não encontrado", 404, "NAO_ENCONTRADO")

        const professional = await this.professionalRepository.findById(data.profissional_id)
        if (!professional) throw new AppError("Profissional não encontrado", 404, "NAO_ENCONTRADO")

        const validAddress = await this.customerRepository.addressBelongsToCustomer(data.endereco_id, data.cliente_id)
        if (!validAddress) throw new AppError("O endereço informado não pertence a este cliente", 400, "ENDERECO_INVALIDO")

        return { ...data, data_hora_inicio: start, data_hora_fim: end }
    }
}

export const appointmentService = new AppointmentService(appointmentRepository, customerRepository, professionalRepository)
