export type UserRole = "ADMIN" | "OPERADOR"

export interface PublicUser {
    id: number
    nome: string
    email: string
    perfil: UserRole
    ativo: boolean
    criado_em: string
}

export interface Customer {
    id: number
    nome: string
    cpf_cnpj: string
    telefone: string
    email: string
    criado_em: string
}

export interface Address {
    id: number
    cliente_id: number
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    cep: string
}

export interface Professional {
    id: number
    nome: string
    cpf: string
    telefone: string
    email: string
}

export interface Availability {
    id: number
    profissional_id: number
    dia_semana: number
    hora_inicio: string
    hora_fim: string
}

export type CleaningType = "RESIDENCIAL" | "COMERCIAL"

export interface AppointmentDetails {
    id: number
    cliente_id: number
    profissional_id: number
    endereco_id: number
    tipo: CleaningType
    data_hora_inicio: string
    data_hora_fim: string
    observacoes: string | null
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

export type ActionType = "CRIACAO" | "EDICAO" | "EXCLUSAO"

export interface AppointmentHistoryDetails {
    id: number
    agendamento_id: number | null
    cliente_id: number
    profissional_id: number
    usuario_id: number
    acao: ActionType
    data_hora: string
    cliente_nome: string
    profissional_nome: string
    usuario_nome: string
}

export type SortCriterion = "data" | "cliente" | "profissional"

export interface ApiError {
    error: string
    code: string
}
