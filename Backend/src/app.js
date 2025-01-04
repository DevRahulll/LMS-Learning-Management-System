import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Userrouter from './routes/user.routes.js';
import morgan from 'morgan'
import errorMiddleware from './middlewares/error.middlewares.js';
import courseRouter from './routes/course.routes.js';
import paymentRouter from './routes/payment.routes.js';

const app = express();

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URI || 'http://localhost:5173',
    credentials: true,
}))
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/v1/user', Userrouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/payments', paymentRouter)
app.get('/ping', (_req, res) => {
    res.send("<h1>Pong</h1>")
})
app.all('*', (req, res) => {
    res.send("OOPS!!! 404 Page not found ")
})

app.use(errorMiddleware)

export default app;
