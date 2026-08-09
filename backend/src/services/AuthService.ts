import bcrypt from "bcrypt";
import { createHash } from "../utils/createHash";
import { signAccessToken } from "../utils/jwt";
import { AppError } from "../utils/errorTreatment";
import { AuthRepository, authRepository } from "../repositories/AuthRepository";
import type { UserRole, PublicUser } from "../models/User";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginInput {
    email?: string
    senha?: string
}

interface RegisterInput {
    nome?: string
    email?: string
    senha?: string
    perfil?: UserRole
}

export class AuthService {
    constructor(private readonly repository: AuthRepository) { }

    async login(data: LoginInput) {
        const email = data.email?.trim().toLowerCase()
        const password = data.senha

        if (!email) throw new AppError("Informe o e-mail", 400, "CAMPO_OBRIGATORIO")
        if (!password) throw new AppError("Informe a senha", 400, "CAMPO_OBRIGATORIO")
        if (!EMAIL_REGEX.test(email)) throw new AppError("E-mail inválido", 400, "EMAIL_INVALIDO")

        const user = await this.repository.findByEmail(email)
        const passwordMatches = await bcrypt.compare(password, user?.senha_hash ?? "")

        if (!user || !user.ativo || !passwordMatches) {
            throw new AppError("E-mail ou senha incorretos", 401, "CREDENCIAIS_INVALIDAS")
        }

        const accessToken = signAccessToken({
            id: user.id,
            nome: user.nome,
            email: user.email,
            perfil: user.perfil
        })

        const { senha_hash, ...publicUser } = user

        return { accessToken, user: publicUser as PublicUser }
    }

    async register(data: RegisterInput) {
        const name = data.nome?.trim()
        const email = data.email?.trim().toLowerCase()
        const password = data.senha

        if (!name) throw new AppError("Informe o nome", 400, "CAMPO_OBRIGATORIO")
        if (!email) throw new AppError("Informe o e-mail", 400, "CAMPO_OBRIGATORIO")
        if (!EMAIL_REGEX.test(email)) throw new AppError("E-mail inválido", 400, "EMAIL_INVALIDO")
        if (!password || password.length < 6) throw new AppError("A senha deve ter ao menos 6 caracteres", 400, "SENHA_INVALIDA")

        const existing = await this.repository.findByEmail(email)
        if (existing) throw new AppError("Já existe um usuário com este e-mail", 409, "EMAIL_EM_USO")

        const senha_hash = await createHash(password)
        const user = await this.repository.create({
            nome: name,
            email,
            senha_hash,
            perfil: data.perfil === "ADMIN" ? "ADMIN" : "OPERADOR"
        })

        const { senha_hash: _hash, ...publicUser } = user
        return publicUser as PublicUser
    }

    async getProfile(id: number) {
        const user = await this.repository.findById(id)
        if (!user) throw new AppError("Usuário não encontrado", 404, "NAO_ENCONTRADO")

        const { senha_hash, ...publicUser } = user
        return publicUser as PublicUser
    }
}

export const authService = new AuthService(authRepository)
