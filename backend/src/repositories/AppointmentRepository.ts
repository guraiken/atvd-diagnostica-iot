import type { Pool, PoolClient } from "pg"
import { pool, transaction } from "../db/pool"
import type { Appointment, AppointmentDetails, AppointmentInput } from "../models/Appointment"
import type { Availability } from "../models/Availability"
import type { ActionType } from "../models/AppointmentHistory"

const DETAILED_SELECT = `
    SELECT
        a.id, a.cliente_id, a.profissional_id, a.endereco_id, a.tipo,
        a.data_hora_inicio, a.data_hora_fim, a.observacoes,
        c.nome AS cliente_nome,
        p.nome AS profissional_nome,
        e.logradouro AS endereco_logradouro,
        e.bairro AS endereco_bairro,
        e.cidade AS endereco_cidade
    FROM agendamento a
    JOIN cliente c ON c.id = a.cliente_id
    JOIN profissional p ON p.id = a.profissional_id
    JOIN endereco e ON e.id = a.endereco_id
`

export class AppointmentRepository {
    constructor(private readonly pool: Pool) { }

    async list() {
        const result = await this.pool.query<AppointmentDetails>(
            `${DETAILED_SELECT} ORDER BY a.data_hora_inicio`
        )
        return result.rows
    }

    async listUnsorted() {
        const result = await this.pool.query<AppointmentDetails>(DETAILED_SELECT)
        return result.rows
    }

    async search(term: string) {
        const result = await this.pool.query<AppointmentDetails>(
            `${DETAILED_SELECT}
             WHERE c.nome ILIKE $1
                OR p.nome ILIKE $1
                OR a.tipo::text ILIKE $1
                OR COALESCE(a.observacoes, '') ILIKE $1
                OR e.bairro ILIKE $1
                OR e.cidade ILIKE $1
             ORDER BY a.data_hora_inicio`,
            [`%${term}%`]
        )
        return result.rows
    }

    async findById(id: number) {
        const result = await this.pool.query<AppointmentDetails>(
            `${DETAILED_SELECT} WHERE a.id = $1`,
            [id]
        )
        return result.rows[0] ?? null
    }

    async listUpcoming(start: string, end: string) {
        const result = await this.pool.query<AppointmentDetails>(
            `${DETAILED_SELECT}
             WHERE a.data_hora_inicio BETWEEN $1 AND $2
             ORDER BY a.data_hora_inicio`,
            [start, end]
        )
        return result.rows
    }

    async findConflicts(professionalId: number, start: string, end: string, ignoreId?: number) {
        const params: unknown[] = [professionalId, start, end]
        let idFilter = ""
        if (ignoreId) {
            params.push(ignoreId)
            idFilter = "AND id <> $4"
        }
        const result = await this.pool.query<Appointment>(
            `SELECT * FROM agendamento
             WHERE profissional_id = $1
               AND data_hora_inicio < $3
               AND data_hora_fim > $2
               ${idFilter}`,
            params
        )
        return result.rows
    }

    async findAvailability(professionalId: number, weekday: number) {
        const result = await this.pool.query<Availability>(
            `SELECT * FROM disponibilidade WHERE profissional_id = $1 AND dia_semana = $2`,
            [professionalId, weekday]
        )
        return result.rows
    }

    async create(data: AppointmentInput, userId: number) {
        return transaction(async (client) => {
            const inserted = await client.query<Appointment>(
                `INSERT INTO agendamento
                    (cliente_id, profissional_id, endereco_id, tipo, data_hora_inicio, data_hora_fim, observacoes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [data.cliente_id, data.profissional_id, data.endereco_id, data.tipo,
                data.data_hora_inicio, data.data_hora_fim, data.observacoes ?? null]
            )
            const appointment = inserted.rows[0] as Appointment
            await recordHistory(client, appointment.id, appointment.cliente_id, appointment.profissional_id, userId, "CRIACAO")
            return appointment
        })
    }

    async update(data: AppointmentInput, id: number, userId: number) {
        return transaction(async (client) => {
            const updated = await client.query<Appointment>(
                `UPDATE agendamento
                 SET cliente_id = $1, profissional_id = $2, endereco_id = $3, tipo = $4,
                     data_hora_inicio = $5, data_hora_fim = $6, observacoes = $7
                 WHERE id = $8
                 RETURNING *`,
                [data.cliente_id, data.profissional_id, data.endereco_id, data.tipo,
                data.data_hora_inicio, data.data_hora_fim, data.observacoes ?? null, id]
            )
            const appointment = updated.rows[0] as Appointment
            await recordHistory(client, appointment.id, appointment.cliente_id, appointment.profissional_id, userId, "EDICAO")
            return appointment
        })
    }

    async remove(id: number, customerId: number, professionalId: number, userId: number) {
        return transaction(async (client) => {
            await recordHistory(client, id, customerId, professionalId, userId, "EXCLUSAO")
            await client.query("DELETE FROM agendamento WHERE id = $1", [id])
        })
    }
}

async function recordHistory(
    client: PoolClient,
    appointmentId: number,
    customerId: number,
    professionalId: number,
    userId: number,
    action: ActionType
) {
    await client.query(
        `INSERT INTO historico_agendamento (agendamento_id, cliente_id, profissional_id, usuario_id, acao)
         VALUES ($1, $2, $3, $4, $5)`,
        [appointmentId, customerId, professionalId, userId, action]
    )
}

export const appointmentRepository = new AppointmentRepository(pool)
