import { Router } from "express"
import { authController } from "../controllers/AuthController"

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
    return authController.login(req, res)
})

authRouter.post('/logout', async (req, res) => {
    return authController.logout(req, res)
})

authRouter.post('/usuarios', async (req, res) => {
    return authController.register(req, res)
})
