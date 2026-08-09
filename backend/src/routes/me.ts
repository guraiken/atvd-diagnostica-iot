import { Router } from "express"
import { authController } from "../controllers/AuthController"

export const meRouter = Router()

meRouter.get('/me', async (req, res) => {
    return authController.me(req, res)
})
