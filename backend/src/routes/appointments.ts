import { Router } from "express"
import { appointmentController } from "../controllers/AppointmentController"

export const appointmentRouter = Router()

appointmentRouter.get('/agendamentos/ordenados', async (req, res) => {
    return appointmentController.listSorted(req, res)
})

appointmentRouter.get('/agendamentos/proximos', async (req, res) => {
    return appointmentController.listUpcoming(req, res)
})

appointmentRouter.get('/agendamentos', async (req, res) => {
    return appointmentController.list(req, res)
})

appointmentRouter.get('/agendamentos/:id', async (req, res) => {
    return appointmentController.findById(req, res)
})

appointmentRouter.post('/agendamentos', async (req, res) => {
    return appointmentController.create(req, res)
})

appointmentRouter.put('/agendamentos/:id', async (req, res) => {
    return appointmentController.update(req, res)
})

appointmentRouter.delete('/agendamentos/:id', async (req, res) => {
    return appointmentController.remove(req, res)
})
