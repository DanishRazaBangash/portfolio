import { Helmet } from 'react-helmet-async'

const BASE_URL    = 'https://danishraza.dev'
const DEFAULT_IMG = `${BASE_URL}/og-image.png`
const SITE_NAME   = 'Danish Raza'

export default function SEOMeta({
  title,
  description = 'Full-stack MERN developer and AI Integration Specialist based in Peshawar, Pakistan. Architected BotForge with ~90% RAG retrieval accuracy.',
  image,
  path = '/',
  type = 'website',
  publishedAt,
  updatedAt,
  tags = [],
  noindex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — MERN Stack Developer & AI Integration Specialist`
  const fullUrl   = `${BASE_URL}${path}`
  const ogImage   = image || DEFAULT_IMG
  const isArticle = type === 'article'

  const blogPostingSchema = isArticle ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,          // raw post title, no site-name suffix
    description,
    image: ogImage,
    url: fullUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    keywords: tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Danish Raza',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Danish Raza',
      url: BASE_URL,
    },
  }) : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <meta name="robots"             content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical"           href={fullUrl} />

      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={fullUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="en_US" />
      {isArticle && publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {isArticle && updatedAt   && <meta property="article:modified_time"  content={updatedAt} />}
      {isArticle && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {isArticle && <script type="application/ld+json">{blogPostingSchema}</script>}
    </Helmet>
  )
}
