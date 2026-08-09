import { CustomerRepository, customerRepository } from "../repositories/CustomerRepository"
import { AppError } from "../utils/errorTreatment"

export class CustomerService {
    constructor(private readonly repository: CustomerRepository) { }

    async list() {
        return this.repository.list()
    }

    async listAddresses(customerId: number) {
        const customer = await this.repository.findById(customerId)
        if (!customer) throw new AppError("Cliente não encontrado", 404, "NAO_ENCONTRADO")

        return this.repository.listAddresses(customerId)
    }
}

export const customerService = new CustomerService(customerRepository)
