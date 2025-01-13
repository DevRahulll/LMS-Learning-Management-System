import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middlewares.js';
import { config } from 'dotenv'
import Userrouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import paymentRouter from './routes/payment.routes.js';
import misRouter from './routes/miscellaneous.routes.js';

config();

const app = express();

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.FRONTEND_URI],
    credentials: true,
}))
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/ping', (_req, res) => {
    res.send("<h1>Pong</h1>")
})
app.use('/api/v1/user', Userrouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1', misRouter)
app.all('*', (_req, res) => {
    res.send("OOPS!!! 404 Page not found ")
})

app.use(errorMiddleware)

export default app;
