import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'
import authRoutes    from './routes/auth.js'
import postRoutes    from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import contactRoutes from './routes/contact.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '2mb' }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false })
app.use('/api', limiter)

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 })

app.use('/api/auth',     authRoutes)
app.use('/api/posts',    postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/contact',  contactLimiter, contactRoutes)

app.get('/api/health', (_, res) => res.json({ ok: true }))

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1) })
