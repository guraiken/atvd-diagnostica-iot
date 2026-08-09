import { Router } from "express"
import { professionalController } from "../controllers/ProfessionalController"

export const professionalRouter = Router()

professionalRouter.get('/profissionais', async (req, res) => {
    return professionalController.list(req, res)
})

professionalRouter.get('/profissionais/:id/disponibilidade', async (req, res) => {
    return professionalController.listAvailability(req, res)
})
