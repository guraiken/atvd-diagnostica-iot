import type { Pool } from "pg"
import { pool } from "../db/pool"
import type { AppointmentHistoryDetails } from "../models/AppointmentHistory"

export class AppointmentHistoryRepository {
    constructor(private readonly pool: Pool) { }

    async list() {
        const result = await this.pool.query<AppointmentHistoryDetails>(
            `SELECT
                h.id, h.agendamento_id, h.cliente_id, h.profissional_id, h.usuario_id,
                h.acao, h.data_hora,
                c.nome AS cliente_nome,
                p.nome AS profissional_nome,
                u.nome AS usuario_nome
             FROM historico_agendamento h
             JOIN cliente c ON c.id = h.cliente_id
             JOIN profissional p ON p.id = h.profissional_id
             JOIN usuario u ON u.id = h.usuario_id
             ORDER BY h.data_hora DESC`
        )
        return result.rows
    }
}

export const appointmentHistoryRepository = new AppointmentHistoryRepository(pool)
