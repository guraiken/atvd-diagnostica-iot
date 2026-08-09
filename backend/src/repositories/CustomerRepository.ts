import type { Pool } from "pg"
import { pool } from "../db/pool"
import type { Customer } from "../models/Customer"
import type { Address } from "../models/Address"

export class CustomerRepository {
    constructor(private readonly pool: Pool) { }

    async list() {
        const result = await this.pool.query<Customer>("SELECT * FROM cliente ORDER BY nome")
        return result.rows
    }

    async findById(id: number) {
        const result = await this.pool.query<Customer>("SELECT * FROM cliente WHERE id = $1", [id])
        return result.rows[0] ?? null
    }

    async listAddresses(customerId: number) {
        const result = await this.pool.query<Address>(
            "SELECT * FROM endereco WHERE cliente_id = $1 ORDER BY logradouro",
            [customerId]
        )
        return result.rows
    }

    async addressBelongsToCustomer(addressId: number, customerId: number) {
        const result = await this.pool.query(
            "SELECT 1 FROM endereco WHERE id = $1 AND cliente_id = $2",
            [addressId, customerId]
        )
        return (result.rowCount ?? 0) > 0
    }
}

export const customerRepository = new CustomerRepository(pool)
