import Post from '../models/Post.js'

const DOMAIN = 'https://danishraza.dev'

const staticPages = [
  { url: '/',      changefreq: 'weekly', priority: '1.0' },
  { url: '/blog',  changefreq: 'daily',  priority: '0.9' },
]

export default async function sitemapHandler(req, res) {
  try {
    const posts = await Post.find({ status: 'published' })
      .select('slug updatedAt')
      .lean()

    const staticEntries = staticPages.map(
      (p) => `  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )

    const postEntries = posts.map(
      (p) => `  <url>
    <loc>${DOMAIN}/blog/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(xml)
  } catch (err) {
    console.error('Sitemap error:', err)
    res.status(500).send('Error generating sitemap')
  }
}
