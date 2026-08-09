import type { Pool } from "pg"
import { pool } from "../db/pool"
import type { User, UserRole } from "../models/User"

export class AuthRepository {
    constructor(private readonly pool: Pool) { }

    async findByEmail(email: string) {
        const result = await this.pool.query<User>(
            "SELECT * FROM usuario WHERE email = $1",
            [email]
        )
        return result.rows[0] ?? null
    }

    async findById(id: number) {
        const result = await this.pool.query<User>(
            "SELECT * FROM usuario WHERE id = $1",
            [id]
        )
        return result.rows[0] ?? null
    }

    async create(data: { nome: string; email: string; senha_hash: string; perfil: UserRole }) {
        const result = await this.pool.query<User>(
            `INSERT INTO usuario (nome, email, senha_hash, perfil)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [data.nome, data.email, data.senha_hash, data.perfil]
        )
        return result.rows[0] as User
    }
}

export const authRepository = new AuthRepository(pool)
