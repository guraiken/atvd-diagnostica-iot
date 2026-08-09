import { Router } from "express"
import { customerController } from "../controllers/CustomerController"

export const customerRouter = Router()

customerRouter.get('/clientes', async (req, res) => {
    return customerController.list(req, res)
})

customerRouter.get('/clientes/:id/enderecos', async (req, res) => {
    return customerController.listAddresses(req, res)
})
