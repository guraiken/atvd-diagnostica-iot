export type UserRole = "ADMIN" | "OPERADOR"

export interface User {
    id: number
    nome: string
    email: string
    senha_hash: string
    perfil: UserRole
    ativo: boolean
    criado_em: string
}

export type PublicUser = Omit<User, "senha_hash">

export interface UserToken {
    id: number
    nome: string
    email: string
    perfil: UserRole
}
