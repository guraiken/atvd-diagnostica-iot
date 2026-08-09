export type ActionType = "CRIACAO" | "EDICAO" | "EXCLUSAO"

export interface AppointmentHistory {
    id: number
    agendamento_id: number | null
    cliente_id: number
    profissional_id: number
    usuario_id: number
    acao: ActionType
    data_hora: string
}

export interface AppointmentHistoryDetails extends AppointmentHistory {
    cliente_nome: string
    profissional_nome: string
    usuario_nome: string
}
