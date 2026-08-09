import { Router } from "express"
import { appointmentHistoryController } from "../controllers/AppointmentHistoryController"

export const historyRouter = Router()

historyRouter.get('/historico', async (req, res) => {
    return appointmentHistoryController.list(req, res)
})
