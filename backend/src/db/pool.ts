import pg from "pg"
import { env } from "../env"
import { formatDate } from "../utils/dateTime"

pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, formatDate)

export const pool = new pg.Pool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName
})

export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        const result = await fn(client)
        await client.query("COMMIT")
        return result
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}
