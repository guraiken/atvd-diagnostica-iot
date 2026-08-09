import type { Pool } from "pg"
import { pool } from "../db/pool"
import type { Professional } from "../models/Professional"
import type { Availability } from "../models/Availability"

export class ProfessionalRepository {
    constructor(private readonly pool: Pool) { }

    async list() {
        const result = await this.pool.query<Professional>("SELECT * FROM profissional ORDER BY nome")
        return result.rows
    }

    async findById(id: number) {
        const result = await this.pool.query<Professional>("SELECT * FROM profissional WHERE id = $1", [id])
        return result.rows[0] ?? null
    }

    async listAvailability(professionalId: number) {
        const result = await this.pool.query<Availability>(
            "SELECT * FROM disponibilidade WHERE profissional_id = $1 ORDER BY dia_semana",
            [professionalId]
        )
        return result.rows
    }
}

export const professionalRepository = new ProfessionalRepository(pool)
