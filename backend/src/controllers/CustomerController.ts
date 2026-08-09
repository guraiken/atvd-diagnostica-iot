import type { Request, Response } from "express";
import { CustomerService, customerService } from "../services/CustomerService";
import { AppError } from "../utils/errorTreatment";

function paramId(value: unknown, name = "id"): number {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(`O parâmetro "${name}" deve ser um número inteiro positivo`, 400, "PARAMETRO_INVALIDO")
    }
    return parsed
}

class CustomerController {
    constructor(private readonly service: CustomerService) { }

    async list(_req: Request, res: Response) {
        const data = await this.service.list()
        return res.status(200).json({
            message: "Clientes encontrados com sucesso!",
            data
        })
    }

    async listAddresses(req: Request, res: Response) {
        const customerId = paramId(req.params.id)
        const data = await this.service.listAddresses(customerId)
        return res.status(200).json({
            message: "Endereços encontrados com sucesso!",
            data
        })
    }
}

export const customerController = new CustomerController(customerService)
