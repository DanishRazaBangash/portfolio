import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { connectDB } from './config/db.js'
import authRoutes    from './routes/auth.js'
import postRoutes    from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import contactRoutes from './routes/contact.js'
import sitemapHandler from './routes/sitemap.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

// Render (and most cloud hosts) sit behind a reverse proxy
app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", 'https://chatbot-builder-widget.onrender.com'],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc:      ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc:  ["'self'", 'https://api.github.com', 'https://github-contributions-api.jogruber.de', 'https://chatbot-builder-widget.onrender.com', 'https://chatbot-builder-api-2v3u.onrender.com'],
      fontSrc:     ["'self'", 'data:', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: isProd ? [] : null,
    },
  },
}))

const allowedOrigins = isProd
  ? [process.env.CLIENT_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(morgan(isProd ? 'combined' : 'dev'))
app.use(express.json({ limit: '2mb' }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false })
app.use('/api', limiter)

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 })

app.use('/api/auth',     authRoutes)
app.use('/api/posts',    postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/contact',  contactLimiter, contactRoutes)

app.get('/api/health', (_, res) => res.json({ ok: true }))
app.get('/sitemap.xml', sitemapHandler)

if (isProd) {
  const distPath = join(__dirname, '../client/dist')
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')))
}

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1) })
