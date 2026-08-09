import { auth } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import { authRouter } from './routes/auth';
import { meRouter } from './routes/me';
import { appointmentRouter } from './routes/appointments';
import { customerRouter } from './routes/customers';
import { professionalRouter } from './routes/professionals';
import { historyRouter } from './routes/history';
import { env } from './env';

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: env.corsOrigin,
  credentials: true
}))

app.use(authRouter)
app.use(auth)

app.use(meRouter)
app.use(appointmentRouter)
app.use(customerRouter)
app.use(professionalRouter)
app.use(historyRouter)

app.use(errorHandler)

app.listen(env.port, () => {
  console.log("Servidor rodando na porta :)" + env.port)
})
