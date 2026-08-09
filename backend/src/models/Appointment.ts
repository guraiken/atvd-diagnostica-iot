export type CleaningType = "RESIDENCIAL" | "COMERCIAL"

export interface Appointment {
    id: number
    cliente_id: number
    profissional_id: number
    endereco_id: number
    tipo: CleaningType
    data_hora_inicio: string
    data_hora_fim: string
    observacoes: string | null
}

export interface AppointmentDetails extends Appointment {
    cliente_nome: string
    profissional_nome: string
    endereco_logradouro: string
    endereco_bairro: string
    endereco_cidade: string
}

export interface AppointmentInput {
    cliente_id: number
    profissional_id: number
    endereco_id: number
    tipo: CleaningType
    data_hora_inicio: string
    data_hora_fim: string
    observacoes?: string | null
}

export type AlertType = "CONFLITO_HORARIO" | "INDISPONIBILIDADE"

export interface Alert {
    tipo: AlertType
    mensagem: string
}
