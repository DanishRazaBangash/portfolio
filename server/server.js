import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { connectDB } from './config/db.js'
import authRoutes    from './routes/auth.js'
import postRoutes    from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import contactRoutes from './routes/contact.js'
import Post from './models/Post.js'

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

const DOMAIN   = 'https://danishraza.dev'
const SITE     = 'Danish Raza'
const DEF_DESC = 'Full-stack MERN developer and AI Integration Specialist based in Peshawar, Pakistan. Architected BotForge with ~90% RAG retrieval accuracy.'
const DEF_IMG  = `${DOMAIN}/og-image.png`

// Escape special HTML characters so injected values can't break the document
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Replace the static meta tags baked into index.html with route-specific values.
// The regexes are deliberately simple because we control the template format.
function injectMeta(template, { title, description, url, image, extraHead = '' }) {
  return template
    .replace(/(<title>)[^<]*(<\/title>)/,                                  `$1${escHtml(title)}$2`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/,           `$1${escHtml(description)}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/,                 `$1${url}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,            `$1${url}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,          `$1${escHtml(title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,    `$1${escHtml(description)}$2`)
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/,          `$1${image}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,         `$1${escHtml(title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,   `$1${escHtml(description)}$2`)
    .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,         `$1${image}$2`)
    .replace('</head>', `${extraHead}</head>`)
}

app.get('/sitemap.xml', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt').lean()
    const today = new Date().toISOString().split('T')[0]
    const staticEntries = [
      `  <url><loc>${DOMAIN}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `  <url><loc>${DOMAIN}/blog</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    ]
    const postEntries = posts.map((p) =>
      `  <url><loc>${DOMAIN}/blog/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    )
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...postEntries].join('\n')}\n</urlset>`
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(xml)
  } catch (err) {
    console.error('Sitemap error:', err)
    res.status(500).send('Error generating sitemap')
  }
})

if (isProd) {
  const distPath = join(__dirname, '../client/dist')
  // Read template once at startup — every deploy restarts the server anyway
  const template = readFileSync(join(distPath, 'index.html'), 'utf-8')

  // { index: false } prevents express.static from serving index.html for '/'
  // so our smart catch-all below handles every HTML request instead
  app.use(express.static(distPath, { index: false }))

  app.get('*', async (req, res) => {
    const pathname = req.path

    const meta = {
      title:       `${SITE} — MERN Stack Developer & AI Integration Specialist`,
      description: DEF_DESC,
      url:         `${DOMAIN}${pathname}`,
      image:       DEF_IMG,
      extraHead:   '',
    }

    if (pathname === '/blog') {
      meta.title       = `Blog — ${SITE}`
      meta.description = 'Thoughts on MERN development, AI integration, RAG pipelines, and building things at scale — by Danish Raza.'

    } else if (pathname.startsWith('/blog/')) {
      const slug = pathname.slice(6)
      try {
        const post = await Post
          .findOne({ slug, status: 'published' })
          .select('title excerpt coverImage publishedAt updatedAt tags')
          .lean()

        if (post) {
          meta.title       = `${post.title} — ${SITE}`
          meta.description = post.excerpt || DEF_DESC
          if (post.coverImage) meta.image = post.coverImage

          // Inject BlogPosting JSON-LD for this specific post
          meta.extraHead = `<script type="application/ld+json">${JSON.stringify({
            '@context':        'https://schema.org',
            '@type':           'BlogPosting',
            headline:           post.title,
            description:        meta.description,
            image:              meta.image,
            url:                meta.url,
            mainEntityOfPage:  { '@type': 'WebPage', '@id': meta.url },
            datePublished:      post.publishedAt,
            dateModified:       post.updatedAt || post.publishedAt,
            keywords:           (post.tags || []).join(', '),
            author:            { '@type': 'Person', name: SITE, url: DOMAIN },
            publisher:         { '@type': 'Person', name: SITE, url: DOMAIN },
          })}</script>`
        }
      } catch (err) {
        console.error('SSR meta error for', slug, err.message)
        // fall through — serve with defaults, never crash the request
      }
    }

    res.send(injectMeta(template, meta))
  })
}

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1) })
